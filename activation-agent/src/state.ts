import type { BaseMessage } from '@langchain/core/messages'
import { Annotation } from '@langchain/langgraph'

const GraphState = Annotation.Root({
  generated_tweets: Annotation<BaseMessage[]>({
    reducer: (x, y): BaseMessage[] => x.concat(y),
  }),
  handle: Annotation<string>,
  email: Annotation<string>,
  tweets: Annotation<string[]>,
  twitter_personality: Annotation<string>,
  request_id: Annotation<number>,
  is_picked: Annotation<boolean>,
  is_verified: Annotation<boolean>,
  submission_id: Annotation<string>,
  submission_details: Annotation<string>,
  submitted_tweet_ids: Annotation<string[]>,
})

export default GraphState
