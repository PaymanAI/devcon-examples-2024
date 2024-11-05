import type GraphState from './state'
import { addRequest, completeRequest, verifiyRequest } from './storage'
import { fetchTweetsByHandle } from './twitter'
import { findTweetsByIds } from './twitter'

type TweetResult = {
  tweets: string[]
}

type TaskResult = {
  request_id: number | bigint
}

const payout = 1.0

export const toolFetchTweets = async (
  state: typeof GraphState.State,
): Promise<TweetResult> => {
  return {
    tweets: await fetchTweetsByHandle(state.handle, 50),
  }
}

export const toolCreateRequest = async (
  state: typeof GraphState.State,
  config: any,
): Promise<TaskResult> => {
  const tweet_text = state.generated_tweets[state.generated_tweets.length - 1]
    .content as string
  const thread_id = config.configurable?.thread_id ?? ''

  const request_id = await addRequest(
    thread_id,
    state.handle,
    state.email,
    payout,
    tweet_text,
  )

  return {
    request_id: request_id,
  }
}

export const toolVerifyRequestSubmission = async (
  state: typeof GraphState.State,
) => {
  const request_id = state.request_id
  const submission_id = state.submission_id
  const tweetIds = state.submitted_tweet_ids
  const expectedTweet =
    state.generated_tweets[state.generated_tweets.length - 1].content
  const tweetTexts = await findTweetsByIds(tweetIds)

  for (const tweetText of tweetTexts) {
    // need to find better way to find the match; can https://en.wikipedia.org/wiki/Levenshtein_distance help?
    // may be an agent?
    // may be an agent using Levenshtein distance algorithm :)
    if (tweetText === expectedTweet) {
      verifiyRequest(request_id)

      return {
        is_verified: true,
      }
    }
  }

  return {
    is_verified: false,
  }
}

export const toolRequestSubmissionComplete = async (
  state: typeof GraphState.State,
) => {
	try {
		const response = await fetch(
			`${Bun.env.PAYMAN_API_BASE}/payments/send-payment`,
			{
				method: "POST",
				body: JSON.stringify({
					amountDecimal: payout.toFixed(2),
					currencyCode: "USDCBASE",
					email: state.email,
					walletId: Bun.env.PAYMAN_WALLET_ID,
				}),
				headers: {
					"x-payman-api-secret": Bun.env.PAYMAN_API_SECRET ?? "",
					"Content-Type": "application/json",
				},
			},
		);

		if (response.status === 200) {
			await completeRequest(state.request_id);
		} else {
      console.error("Payment send error", response);
      console.error("Payment send error", response.json);
    }
	} catch (e) {
		console.error("Payment send error", e);
	}
}