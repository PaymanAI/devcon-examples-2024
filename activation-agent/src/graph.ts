import { END, START, StateGraph } from '@langchain/langgraph'
import {
  tweetTextGenerater,
  twitterIdExtracter,
  twitterPersonalityGenerater,
} from './agents'
import { analyzeUserChoice, checkVerificationResult } from './functions'
import GraphState from './state'
import {
  toolCreateRequest,
  toolFetchTweets,
  toolVerifyRequestSubmission,
  toolRequestSubmissionComplete
} from './tools'
import { SqliteSaver } from "./chechpoint_sqlite"
import { Database } from 'bun:sqlite'

const workflow = new StateGraph(GraphState)
  .addNode('tool_fetch_tweets', toolFetchTweets)
  .addNode('agent_generate_twitter_personality', twitterPersonalityGenerater)
  .addNode('agent_generate_tweet_text', tweetTextGenerater)
  .addNode('interrupt_user_choice', async () => {})
  .addNode('tool_create_request', toolCreateRequest)
  .addNode('interrupt_request_submission_create', () => ({}))
  .addNode('agent_request_submission_analyzer', twitterIdExtracter)
  .addNode('tool_request_submission_verifier', toolVerifyRequestSubmission)
  .addNode('tool_request_submission_complete', toolRequestSubmissionComplete)

  .addEdge(START, 'tool_fetch_tweets')
  .addEdge('tool_fetch_tweets', 'agent_generate_twitter_personality')
  .addEdge('agent_generate_twitter_personality', 'agent_generate_tweet_text')
  .addEdge('agent_generate_tweet_text', 'interrupt_user_choice')
  .addConditionalEdges('interrupt_user_choice', analyzeUserChoice, {
    'tweet-picked': 'tool_create_request',
    'new-tweet-requested': 'agent_generate_tweet_text',
  })
  .addEdge('tool_create_request', 'interrupt_request_submission_create')
  .addEdge('interrupt_request_submission_create', 'agent_request_submission_analyzer')
  .addEdge('agent_request_submission_analyzer', 'tool_request_submission_verifier')
  .addConditionalEdges(
    'tool_request_submission_verifier',
    checkVerificationResult,
    {
      success: 'tool_request_submission_complete',
      failed: 'interrupt_request_submission_create',
    },
  )
  .addEdge('tool_request_submission_complete', END)

  const checkpointer_db = new Database('checkpointer.sqlite')
  const checkpointer = new SqliteSaver(checkpointer_db);

export const app = workflow.compile({
  checkpointer,
  interruptBefore: [
    'interrupt_user_choice',
    'interrupt_request_submission_create',
  ],
})
