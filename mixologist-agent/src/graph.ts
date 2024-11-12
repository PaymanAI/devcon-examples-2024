import { Database } from 'bun:sqlite'
import {
  type AIMessage,
  SystemMessage,
  type ToolMessage,
} from '@langchain/core/messages'
import { END, START, StateGraph } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { ChatOpenAI } from '@langchain/openai'
import { SqliteSaver } from './checkpoint_sqlite'
import { drinks } from './drinks'
import GraphState from './state'
import { generateTools } from './tools'

export const model = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: Bun.env.OPENAI_API_KEY,
  temperature: 0.7,
})
const tools = generateTools()
const modelWithTools = model.bindTools(tools)
const systemMessage = new SystemMessage(`You're an expert bartender, capable of picking the perfect drink for anyone.  
	Work with the user to find out what they like, and then make a recommendation. Only use simple string messages when chatting, no markdown.  
	Once you have determined the perfect drink, you can use the tools to order it for them.  When you order make sure to use the exact name, 
	instructions and price provided in the drinks menu.  You ONLY can make the following drinks:\n${drinks.map(d => d.name).join(',')}`)

async function callModel(state: typeof GraphState.State) {
  const messages = state.messages
  const response = await modelWithTools.invoke([systemMessage, ...messages])

  return { messages: [response] }
}

async function sayGoodbye() {
  return {
    isFinished: true,
  }
}

async function ToolNodeWithGraphState(state: typeof GraphState.State) {
  const tools = generateTools()
  const toolNodeWithConfig = new ToolNode(tools)
  return toolNodeWithConfig.invoke(state)
}

function checkToolCall(state: typeof GraphState.State) {
  const messages = state.messages
  const lastMessage = messages[messages.length - 1] as AIMessage
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return 'tools'
  }

  return 'user_input'
}

function checkToolResponse(state: typeof GraphState.State) {
  const messages = state.messages
  const lastMessage = messages[messages.length - 1] as ToolMessage

  const content = lastMessage.content as string
  if (!content?.includes('Order created successfully')) {
    return 'agent'
  }

  return 'goodbye'
}

const workflow = new StateGraph(GraphState)
  .addNode('user_input', async () => {})
  .addNode('agent', callModel)
  .addNode('tools', ToolNodeWithGraphState)
  .addNode('goodbye', sayGoodbye)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', checkToolCall)
  .addEdge('user_input', 'agent')
  .addConditionalEdges('tools', checkToolResponse)
  .addEdge('goodbye', END)

const checkpointer_db = new Database('checkpointer.sqlite')
const checkpointer = new SqliteSaver(checkpointer_db)

export const app = workflow.compile({
  checkpointer,
  interruptBefore: ['user_input'],
})
