import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph'
import {
  answer_as_agent,
  drink_requester,
  fund_requester,
  generate_image,
  offer_life_advice,
  sing_song,
  tell_joke,
} from './agents'
import GraphState from './state'

const checkpointer = new MemorySaver()

function evaluate_user_input(state: typeof GraphState.State) {
  if (state.message_count >= 10) {
    return END
  } else if (state.message_count % 2 === 0 && state.message_count > 0) {
    return 'ask_for_drink'
  }

  return 'agent'
}

function evaluate_action(state: typeof GraphState.State) {
  if (state.message_count >= 10) {
    return END
  } else if (state.extra.isDrinking) {
    return 'wait_to_entertain'
  }

  return 'user_input'
}

function evaluate_talent_request(state: typeof GraphState.State) {
  if (state.message_count >= 10) {
    return END
  } else if (state.extra.talentReq?.id === 'joke') {
    return 'tell_a_joke'
  } else if (state.extra.talentReq?.id === 'song') {
    return 'sing_a_song'
  } else if (state.extra.talentReq?.id === 'photo') {
    return 'generate_image'
  } else {
    return 'offer_life_advice'
  }
}

export const graph = new StateGraph(GraphState)
  .addNode('user_input', () => ({}))
  .addNode('agent', answer_as_agent)
  .addNode('ask_for_drink', drink_requester)
  .addNode('ask_for_money', fund_requester)
  .addNode('wait_for_money', () => ({}))
  .addNode('wait_to_entertain', () => ({}))
  .addNode('generate_image', generate_image)
  .addNode('tell_a_joke', tell_joke)
  .addNode('sing_a_song', sing_song)
  .addNode('offer_life_advice', offer_life_advice)

  .addEdge(START, 'user_input')
  .addConditionalEdges('user_input', evaluate_user_input)
  .addConditionalEdges('agent', evaluate_action)
  .addConditionalEdges('wait_to_entertain', evaluate_talent_request)
  .addEdge('ask_for_drink', 'ask_for_money')
  .addEdge('ask_for_money', 'wait_for_money')
  .addEdge('wait_for_money', 'agent')
  .addEdge('generate_image', 'user_input')
  .addEdge('tell_a_joke', 'user_input')
  .addEdge('sing_a_song', 'user_input')
  .addEdge('offer_life_advice', 'user_input')
  .compile({
    checkpointer,
    interruptBefore: [
      'ask_for_money',
      'wait_for_money',
      'wait_to_entertain',
      'user_input',
    ],
  })
