import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(Bun.env.TWITTER_APP_BEARER_TOKEN as string)
const readOnlyClient = twitterClient.readOnly;

export async function findTweetsByIds(tweetsIds: string[]) {
  try {
    const resp = await readOnlyClient.v2.singleTweet(tweetsIds[0])
    return resp.data.text
  } catch (e) {
    console.log("Error", e)
    console.warn(
      'Error fetching tweets for ids {}; returning empty array',
      tweetsIds,
      e,
    )
    return []
  }
}

export async function fetchTweetsByHandle(handle: string, count: number) {
  try {
    const tUser = (await readOnlyClient.v2.userByUsername(handle)).data
    if (!tUser) throw new Error("Couldn't find user")

    const resp = await readOnlyClient.v2.userTimeline(tUser.id, {
      exclude: ['replies'],
      max_results: count,
    })
    return resp.data
  } catch (e) {
    console.warn('Error fetching tweets for {}; returning defaults', handle, e)
    return []
  }
}
