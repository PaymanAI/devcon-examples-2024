import type GraphState from './state'

export async function analyzeUserChoice(state: typeof GraphState.State) {
  if (state.is_picked) {
    return 'tweet-picked'
  }

  return 'new-tweet-requested'
}

export async function checkVerificationResult(state: typeof GraphState.State) {
  if (state.is_verified) {
    return 'success'
  }

  return 'failed'
}
