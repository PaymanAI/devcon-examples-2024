import { CollectDetails } from '../frontend/fragments/CollectDetails'
import { GeneratedTweetDetails } from '../frontend/fragments/GeneratedTweetDetails'
import { PickedTweetMessage } from '../frontend/fragments/PickedTweetMessage'
import { ThankYouMessage } from '../frontend/fragments/ThankYouMessage'

export const renderCollectDetails = async () => {
  const html = await CollectDetails()
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderGeneratedTweetDetails = async ({
  thread_id,
  generated_tweet,
  email,
  handle,
}: {
  thread_id?: string
  generated_tweet?: string
  email: string
  handle: string
}) => {
  const html = await GeneratedTweetDetails({
    thread_id: thread_id,
    generated_tweet: generated_tweet,
    email: email,
    handle: handle,
  })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderPickedTweetMessage = async ({
  thread_id,
  pickedTweet,
}: { thread_id: string; pickedTweet: string }) => {
  const html = await PickedTweetMessage({ thread_id, pickedTweet })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderThankYouMessage = async ({
  email,
  tweet,
}: { email: string; tweet: string }) => {
  const html = await ThankYouMessage({ email, tweet })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
