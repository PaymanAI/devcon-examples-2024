import { staticPlugin } from '@elysiajs/static'
import { Elysia, t } from 'elysia'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import { analyzeFeedback } from './agents'
import { graph } from './graph'
import {
  renderAlreadySubmitted,
  renderAnalysis,
  renderDistribution,
  renderGatherFeedback,
  renderProcessingDisplay,
  renderStat,
  renderThankYou,
  renderWordCloud,
} from './renderers'
import {
  getAverageFeedbackLength,
  getAveragePayout,
  getFeedback,
  getFeedbackCount,
  getQualityDistribution,
  getSentimentDistribution,
  getTotalPayments,
  hasUserSubmittedFeedback,
} from './storage'
import { getRemainingBalance } from './tools'

let analysis = 'No analysis available yet'
let wordcloudText = 'No analysis available yet'

export const recomputeAnalysis = async () => {
  const feedback = await getFeedback()

  if (feedback.length === 0) {
    return
  }

  const feedbackString = feedback
    .map(row => {
      return `${row.feedback}\n`
    })
    .join('\n')

  analysis = await analyzeFeedback(feedbackString)
  wordcloudText = feedbackString
}
setInterval(recomputeAnalysis, 1000 * 60)

export const server = new Elysia()
  .use(
    staticPlugin({
      assets: './frontend/static',
    }),
  )
  .post(
    '/thread',
    async ({ body }) => {
      if (await hasUserSubmittedFeedback(body.email)) {
        return renderAlreadySubmitted()
      }

      const thread_id = uuidv4()
      await graph.invoke(
        {
          status: 'waiting_for_input',
        },
        { configurable: { thread_id } },
      )
      await graph.updateState(
        { configurable: { thread_id } },
        {
          feedback: body.feedback,
          email: body.email,
          status: 'analyzing_quality',
        },
        'user_input',
      )
      graph.invoke(null, { configurable: { thread_id } })

      return renderProcessingDisplay({ thread_id })
    },
    {
      body: t.Object({
        feedback: t.String(),
        email: t.String(),
      }),
    },
  )
  .post(
    '/thread/:id',
    async ({ body, params: { id } }) => {
      await graph.updateState(
        { configurable: { thread_id: id } },
        {
          feedback: body.feedback,
          email: body.email,
          status: 'analyzing_quality',
        },
        'user_input',
      )
      graph.invoke(null, { configurable: { thread_id: id } })
      return renderProcessingDisplay({ thread_id: id })
    },
    {
      body: t.Object({
        feedback: t.String(),
        email: t.String(),
      }),
    },
  )
  .get('/start', async () => {
    return renderGatherFeedback({ email: '', feedback: '' })
  })
  .get('/thread/:id', async ({ params: { id } }) => {
    const config = { configurable: { thread_id: id } }
    const state = await graph.getState(config)

    if (state.values.status === 'waiting_for_input') {
      return renderGatherFeedback({
        thread_id: id,
        user_request: state.values.user_request,
        email: state.values.email,
        feedback: state.values.feedback,
      })
    }

    if (state.values.status === 'done') {
      return renderThankYou()
    }

    return renderProcessingDisplay({ thread_id: id })
  })
  .get('/', async () => {
    const html = Bun.file('frontend/index.html')
    return new Response(await html.text(), {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/qrcode', async () => {
    const qrCode = await QRCode.toString(Bun.env.HOSTED_URL ?? '', {
      type: 'svg',
    })
    return new Response(qrCode, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  })
  .get('/analysis', async () => {
    const html = Bun.file('frontend/analysis.html')
    return new Response(await html.text(), {
      headers: { 'Content-Type': 'text/html' },
    })
  })
  .get('/analysis/feedback', async () => {
    return renderAnalysis({ analysis })
  })
  .get('/analysis/count', async () => {
    return renderStat(
      'Responses Received',
      ((await getFeedbackCount()) ?? 0).toFixed(0),
    )
  })
  .get('/analysis/spend', async () => {
    const totalPayments = await getTotalPayments()
    return renderStat(
      'Total Payments',
      `${(totalPayments ?? 0).toFixed(2)} USDC`,
    )
  })
  .get('/analysis/remaining', async () => {
    return renderStat(
      'Remaining Funds',
      `${((await getRemainingBalance()) ?? 0).toFixed(2)} USDC`,
    )
  })
  .get('/analysis/average-length', async () => {
    return renderStat(
      'Average Length (Chars)',
      `${((await getAverageFeedbackLength()) ?? 0).toFixed(2)}`,
    )
  })
  .get('/analysis/average-spend', async () => {
    return renderStat(
      'Average Payout',
      `${((await getAveragePayout()) ?? 0).toFixed(2)} USDC`,
    )
  })
  .get('/analysis/quality', async () => {
    const distro = (await getQualityDistribution()) ?? new Map()
    let total = 0
    let quality = 0

    for (const row of distro) {
      total += row.count
      switch (row.qualifier) {
        case 'medium':
          quality += row.count
          break
        case 'high':
          quality += row.count * 2
          break
      }
    }
    const score = total === 0 ? 0 : (quality * 100) / (total * 2)
    return renderDistribution('Overall Quality', score, 'High', 'Low')
  })
  .get('/analysis/sentiment', async () => {
    const distro = (await getSentimentDistribution()) ?? new Map()
    let total = 0
    let positivity = 0

    for (const row of distro) {
      total += row.count
      switch (row.qualifier) {
        case 'positive':
          positivity += row.count
          break
        case 'neutral':
          break
        case 'negative':
          positivity -= row.count
          break
      }
    }

    const score = total === 0 ? 0 : ((positivity + total) * 100) / (total * 2)
    return renderDistribution(
      'Overall Sentiment',
      score,
      'Positive',
      'Negative',
    )
  })
  .get('/analysis/wordcloud', async () => {
    return renderWordCloud(wordcloudText)
  })
