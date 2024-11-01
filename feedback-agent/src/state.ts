import { Annotation } from '@langchain/langgraph'

const status = {
  analyzing_quality: 'analyzing_quality',
  waiting_for_input: 'waiting_for_input',
  sending_payment: 'sending_payment',
  done: 'done',
} as const

const GraphState = Annotation.Root({
  feedback: Annotation<string>(),
  email: Annotation<string>(),
  user_request: Annotation<string>(),
  status: Annotation<typeof status>(),
  sentiment: Annotation<'negative' | 'positive' | 'neutral'>(),
  quality: Annotation<'low' | 'medium' | 'high'>(),
})

export default GraphState
