import { AlreadySubmitted } from '../frontend/fragments/AlreadySubmitted'
import { AnalysisDisplay } from '../frontend/fragments/AnalysisDisplay'
import { StatDisplay } from '../frontend/fragments/StatDisplay'
import { GatherFeedback } from '../frontend/fragments/GatherFeedback'
import { ProcessingDisplay } from '../frontend/fragments/ProcessingDisplay'
import { ThankYou } from '../frontend/fragments/ThankYou'
import { WordCloudDisplay } from '../frontend/fragments/WordCloudDisplay'
import { DistributionDisplay } from '../frontend/fragments/DistributionDisplay'

export const renderGatherFeedback = async ({
  thread_id,
  user_request,
  email,
  feedback,
}: {
  thread_id?: string
  user_request?: string
  email: string
  feedback: string
}) => {
  const html = await GatherFeedback({
    thread_id: thread_id,
    user_request: user_request,
    email: email,
    feedback: feedback,
  })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderThankYou = async () => {
  const html = await ThankYou()
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderProcessingDisplay = async ({
  thread_id,
}: { thread_id: string }) => {
  const html = await ProcessingDisplay({ thread_id })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderAnalysis = async ({ analysis }: { analysis: string }) => {
  const html = await AnalysisDisplay({ analysis })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderAlreadySubmitted = async () => {
  const html = await AlreadySubmitted()
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderStat = async (title: string, stat: string) => {
  const html = await StatDisplay({ title, stat })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderWordCloud = async (text: string) => {
  const html = await WordCloudDisplay(text)
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderDistribution = async (
  title: string,
  score: number,
  positive: string,
  negative: string,
) => {
  const html = await DistributionDisplay({ title, score, positive, negative })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
