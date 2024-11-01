import { ChatWindow } from '../frontend/fragments/ChatWindow'
import { CheckoutLink } from '../frontend/fragments/CheckoutLink'
import type GraphState from './state'

export const renderChatWindow = async (
  state: typeof GraphState.State,
  thread_id: string,
) => {
  const html = await ChatWindow({
    messages: state.messages,
    isFinished: state.isFinished,
    thread_id,
  })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

export const renderCheckoutLink = async (
  url: string,
  status: string,
  thread_id: string,
) => {
  const html = await CheckoutLink({ url, status, thread_id })
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
