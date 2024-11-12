import { staticPlugin } from '@elysiajs/static'
import { Elysia, t } from 'elysia'
import { v4 as uuidv4 } from 'uuid'
import { app } from './graph'
import {
  renderCollectDetails,
  renderGeneratedTweetDetails,
  renderPickedTweetMessage,
  renderThankYouMessage,
} from './renderers'
import { getRequest } from './storage'

export const server = new Elysia()
  .use(
    staticPlugin({
      assets: './frontend/static',
    }),
  )
  .get('/start', async () => {
    return renderCollectDetails()
  })
  .post('/start', async (req: any) => {
    const thread_id = uuidv4()
    const email = req.body.email
    const handle = req.body.twitter

    const state = await app.invoke(
      {
        handle: req.body.twitter,
        email: req.body.email,
      },
      { configurable: { thread_id: thread_id } },
    )

    const generated_tweet =
      state.generated_tweets[state.generated_tweets.length - 1].content
    return renderGeneratedTweetDetails({
      thread_id,
      generated_tweet,
      email,
      handle,
    })
  })
  .post('/thread/:id/pick', async ({ params: { id } }) => {
    const config = {
      configurable: { thread_id: id },
    }

    await app.updateState(
      config,
      {
        is_picked: true,
      },
      'interrupt_user_choice',
    )
    const state = await app.invoke(null, config)
    const pickedTweet =
      state.generated_tweets[state.generated_tweets.length - 1].content
    return renderPickedTweetMessage({
      thread_id: id,
      pickedTweet: pickedTweet,
    })
  })
  .post('/thread/:id/refresh', async ({ params: { id } }) => {
    const config = {
      configurable: { thread_id: id },
    }

    await app.updateState(
      config,
      {
        is_picked: false,
      },
      'interrupt_user_choice',
    )
    const state = await app.invoke(null, config)

    return state.generated_tweets[state.generated_tweets.length - 1].content
  })
  .post(
    '/thread/:id/submit',
    async ({ body, params: { id } }) => {
      await app.updateState(
        { configurable: { thread_id: id } },
        {
          submission_details: body.tweetURL,
        },
        'interrupt_request_submission_create',
      )
      const state = await app.invoke(null, { configurable: { thread_id: id } })
      const email = state.email

      if (state.is_verified) {
        return renderThankYouMessage({ email, tweet: body.tweetURL })
      }

      const generated_tweet =
        state.generated_tweets[state.generated_tweets.length - 1].content
      return renderPickedTweetMessage({
        thread_id: id,
        pickedTweet: generated_tweet,
      })
    },
    {
      body: t.Object({
        tweetURL: t.String(),
      }),
    },
  )
  .get('/request/:id', async ({ params: { id } }) => {
    const resp = await getRequest(Number(id))
    return JSON.stringify(resp)
  })
  .get('/get-graph-state', async ({ query: { thread_id } }) => {
    return await app.getState({ configurable: { thread_id } })
  })
  .get('/', async () => {
    const html = Bun.file('frontend/index.html')
    return new Response(await html.text(), {
      headers: { 'Content-Type': 'text/html' },
    })
  })
