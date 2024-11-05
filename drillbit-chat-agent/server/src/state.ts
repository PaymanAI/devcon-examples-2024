import { AIMessage, type BaseMessage } from '@langchain/core/messages'
import { Annotation } from '@langchain/langgraph'
import type { Extra } from './types/Extra'

const GraphState = Annotation.Root({
  // conversation
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y): BaseMessage[] => {
      if (y === undefined) {
        return [
          new AIMessage('Hey dude, what brings you to the sunny side of life?'),
        ]
      }
      return x.concat(y)
    },
  }),

  // number of messages sent by human
  message_count: Annotation<number>({
    reducer: (x, y) => {
      if (y === 0) {
        return 0
      }
      return x + y
    },
  }),

  // has graph finished executing
  is_finished: Annotation<boolean>(),

  // extra info to pass data back and forth
  extra: Annotation<Extra>(),

  // id of the human
  customer_id: Annotation<string>(),
})

export const START_STATE = {
  messages: undefined,
  message_count: 0,
  is_finished: undefined,
  extra: undefined,
  customer_id: undefined,
}

export default GraphState
