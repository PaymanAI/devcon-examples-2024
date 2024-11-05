import { Client } from 'twitter-api-sdk'
import type { components } from 'twitter-api-sdk/dist/gen/openapi-types'

const client = new Client(Bun.env.TWITTER_APP_BEARER_TOKEN as string)

export async function findTweetsByIds(tweetsIds: string[]) {
  try {
    const resp = await client.tweets.findTweetsById({ ids: tweetsIds })
    const tweets = resp.data as unknown as components['schemas']['Tweet'][]
    return tweets.map(it => it.text)
  } catch (e) {
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
    const tUser = (await client.users.findUserByUsername(handle)).data
    if (!tUser) throw new Error("Couldn't find user")

    const resp = await client.tweets.usersIdTweets(tUser.id, {
      exclude: ['replies'],
      max_results: count,
    })
    const tweets = resp.data as unknown as components['schemas']['Tweet'][]
    return tweets.map(it => it.text)
  } catch (e) {
    console.warn('Error fetching tweets for {}; returning defaults', handle, e)
    return [
      'My upcoming memoir Source Code is all about the lessons and experiences that laid the foundation for everything in my life that followed',
      'Thank you @AbiyAhmedAli for your warm welcome during my visit to Ethiopia. I’m inspired by our insightful discussions on Ethiopia’s development progress, and I’m excited by the opportunity to continue supporting our partners to track and accelerate progress in health, agriculture and financial inclusion. @PMEthiopia',
      "Aidan’s work to end polio saved countless lives and touched even more. His optimism and commitment to helping others made him a leader in the field—and a great friend to everyone who knew him. I'm sending my deepest condolences to his family and loved ones during this difficult time.",
      'Thanks to incredible work by Indian experts, a study conducted on the Immediate Kangaroo Mother Care (IKMC) method in India, reveals some amazing findings about saving newborn lives. Such innovations have the potential to save countless lives globally. @narendramodi @JPNadda',
      'With Khanmigo’s assistance, teachers at First Avenue Elementary are finding it easier to personalize learning for each individual student.',
    ]
  }
}
