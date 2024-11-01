import type { BaseMessage } from '@langchain/core/messages'
import { Annotation } from '@langchain/langgraph'

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y): BaseMessage[] => x.concat(y),
  }),
  isFinished: Annotation<boolean>(),
})

export default GraphState
