import { EventEmitter } from 'node:events'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import type { LangGraphRunnableConfig } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import type GraphState from './state'
import { addFeedback } from './storage'
import { sendPayment } from './tools'

export const events: EventEmitter = new EventEmitter()

// const model = new ChatOllama({
// 	model: "llama3.1",
// 	temperature: 0.8,
// });

const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0.8,
})

export const inputEvaluator = async (state: typeof GraphState.State) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      quality: z.enum(['low', 'medium', 'high'], {
        description:
          'the quality of the feedback based on how comprehensive, informative and constructive it is',
      }),
      sentiment: z.enum(['negative', 'positive', 'neutral'], {
        description: 'the overall sentiment of the feedback',
      }),
      user_request: z
        .string({
          description:
            'a request for the user if the feedback quality is not good enough',
        })
        .optional(),
    }),
  )

  const promptText = `Given the following feedback from the user. 
        Please analyze this feedback and determine its quality and sentiment. Be generous with your quality assessment
		and consider the feedback's informativeness, constructiveness, and overall helpfulness.
		Always include a brief prompt to the user on how they can improve their feedback.
        {format_instructions}
        {feedback}`
  const prompt = ChatPromptTemplate.fromTemplate(promptText)

  const chain = RunnableSequence.from([prompt, model, parser])
  const result = await chain.invoke({
    feedback: state.feedback,
    format_instructions: parser.getFormatInstructions(),
  })

  return {
    quality: result.quality,
    sentiment: result.sentiment,
    user_request: result.user_request,
    status: 'sending_payment',
  }
}

export const analyzeFeedback = async (feedback: string) => {
  const promptText = `Given the following collection of user feedback about the conference, 
        analyze this feedback and return a markdown document containing the top 3 themes with a 
        short description of each theme. The output should be of the form:

        - **Title of theme 1**

		  Brief description of theme 1
        - **Title of theme 2**

		  Brief description of theme 2
        - **Title of theme 3**
		
		  Brief description of theme 3
        
		Only output the content of the markdown, nothing else.
        Feedback:
        {feedback}`
  const prompt = ChatPromptTemplate.fromTemplate(promptText)

  const result = await prompt.pipe(model).invoke({
    feedback: feedback,
  })

  let analysis = result.content?.toString()

  if (analysis?.startsWith('```')) {
    analysis = analysis.slice(3)
  }

  if (analysis?.endsWith('```')) {
    analysis = analysis.slice(0, -3)
  }

  return analysis ?? ''
}

export const paymentSender = async (
  state: typeof GraphState.State,
  config: LangGraphRunnableConfig,
) => {
  let amount = 0.5
  if (state.quality === 'high') {
    amount = 2
  } else if (state.quality === 'medium') {
    amount = 1
  }
  await addFeedback(
    config.configurable?.thread_id ?? '',
    state.feedback,
    state.email,
    state.quality,
    state.sentiment,
  )
  await sendPayment(state.email, amount, config.configurable?.thread_id ?? '')
  return { status: 'done' }
}
