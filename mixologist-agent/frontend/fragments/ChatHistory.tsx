import type { BaseMessage } from '@langchain/core/messages'
import { isAIMessage } from '@langchain/core/messages'
import { Marked } from '@ts-stack/markdown'
import { TipPanel } from './TipPanel'

export const ChatHistory = ({
  messages,
  thread_id,
}: { messages: BaseMessage[]; thread_id: string }) => {
  const filteredMessages = messages
    .filter(message => message.content?.length)
    .map(message => {
      if (isAIMessage(message)) {
        const content = Marked.parse(`${message.content}`)
        return {
          type: 'ai',
          message: content,
        }
      }

      if (message._getType() === 'tool') {
        return {
          type: 'tool',
          message: JSON.parse(`${message.content}`),
        }
      }
      return {
        type: 'user',
        message: `${message.content}`,
      }
    })

  const isLast = (index: number) => index === filteredMessages.length - 1

  return (
    <div class='conversation' id='conversation'>
      {filteredMessages.map((message, index) => {
        if (message.type === 'ai') {
          return (
            <div class='ai-message' id={isLast(index) ? 'last-chat-item' : ''}>
              <span class='avatar'>
                <img src='/public/buzzed-logo.png' alt='Buzzed Lightbeer' />
              </span>
              {index < filteredMessages.length - 1 ? (
                <span class='speech-bubble'>{message.message}</span>
              ) : (
                <>
                  <span class='typing-source' id='typing-source'>
                    {message.message}
                  </span>
                  <span class='speech-bubble' id='simulateWithTyping' />
                  <script>simulateTyping();</script>
                </>
              )}
            </div>
          )
        }

        if (message.type === 'tool') {
          const drink = message.message
          return (
            <>
              <div class='ai-message'>
                <span class='avatar'>
                  <img src='/public/buzzed-logo.png' alt='Buzzed Lightbeer' />
                </span>
                <span class='speech-bubble'>Coming right up!</span>
              </div>
              <div
                class='drink-card'
                id={isLast(index) ? 'last-chat-item' : ''}
              >
                <img
                  src='/public/buzzed-logo.png'
                  alt='Buzzed light beer'
                  class='drink-image'
                />
                <div class='drink-title'>{drink.drink}</div>
                <div class='drink-description'>
                  Your drink has been ordered and is waiting for you at the bar.
                </div>
                <div class='drink-order-number'>
                  <span style='font-weight: bold'>{drink.order_id}</span>
                </div>
                <div class='drink-order-number-description'>
                  <span style='font-weight: bold'>Order number</span>
                </div>
              </div>
              <TipPanel thread_id={thread_id} />
            </>
          )
        }

        return (
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          <div class='user-message' id={isLast(index) ? 'last-chat-item' : ''}>
            <span class='speech-bubble'>{`${message.message}`}</span>
            <span class='avatar'>
              <img src='/public/user-logo.jpg' alt='User logo' />
            </span>
          </div>
        )
      })}
      <script>resetScreen(60000);</script>
    </div>
  )
}
