import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph'
import { inputEvaluator, paymentSender } from './agents'
import GraphState from './state'

const checkpointer = new MemorySaver()

function hasEnoughFeedback(state: typeof GraphState.State) {
  if (state.feedback) {
    return 'send_payment'
  }
  return 'user_input'
}

export const graph = new StateGraph(GraphState)
  .addNode('user_input', () => ({}))
  .addNode('agent', inputEvaluator)
  .addNode('send_payment', paymentSender)
  .addEdge(START, 'user_input')
  .addEdge('user_input', 'agent')
  .addConditionalEdges('agent', hasEnoughFeedback)
  .addEdge('send_payment', END)
  .compile({ checkpointer, interruptBefore: ['user_input'] })
