import type { Extra } from './Extra'
import type { Message } from './Message'

export interface MessageHistory {
  messages: Message[]
  message_count: number
  extra?: Extra
}
