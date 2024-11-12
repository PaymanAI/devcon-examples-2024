import type { BaseMessage } from '@langchain/core/messages'
import { isAIMessage } from '@langchain/core/messages'
import { Marked } from '@ts-stack/markdown'
import { TipPanel } from './TipPanel'

export const ChatHistory = ({
  messages,
  thread_id,
}: {
  messages: BaseMessage[]
  thread_id: string
}) => {
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
    <div
      class='h-[calc(100%-170px)] overflow-scroll scroll-smooth'
      id='conversation'
    >
      {filteredMessages.map((message, index) => {
        if (message.type === 'ai') {
          return (
            <div
              class='mr-[75px] mb-4 flex flex-row justify-start gap-2.5 self-start'
              id={isLast(index) ? 'last-chat-item' : ''}
            >
              <img
                src='/public/buzzed-logo.png'
                alt='Buzzed Lightbeer'
                class='h-10 w-10 rounded-full bg-white'
              />
              {index < filteredMessages.length - 1 ? (
                <span class='rounded-[32px_32px_32px_0px] bg-[rgb(212,244,255)] p-3 px-6'>
                  {message.message}
                </span>
              ) : (
                <>
                  <span class='hidden' id='typing-source'>
                    {message.message}
                  </span>
                  <span
                    class='rounded-[32px_32px_32px_0px] bg-[rgb(212,244,255)] p-3 px-6'
                    id='simulateWithTyping'
                  />
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
              <div class='mr-[75px] mb-4 flex flex-row justify-start gap-2.5 self-start'>
                <img
                  src='/public/buzzed-logo.png'
                  alt='Buzzed Lightbeer'
                  class='h-10 w-10 rounded-full bg-white'
                />
                <span class='rounded-[32px_32px_32px_0px] bg-[rgb(212,244,255)] p-3 px-6'>
                  Coming right up!
                </span>
              </div>
              <div
                class='relative mb-4 w-[300px] rounded-[0px_27px_27px_27px] bg-black p-10'
                id={isLast(index) ? 'last-chat-item' : ''}
              >
                <img
                  src='/public/buzzed-logo.png'
                  alt='Buzzed light beer'
                  class='absolute top-0 right-0 h-10 w-10 opacity-30'
                />
                <div class='font-extrabold text-2xl text-white leading-[31.25px]'>
                  {drink.drink}
                </div>
                <div class='mb-4 max-w-[200px] text-left font-semibold text-[#9a9a9a] text-xs leading-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.35)]'>
                  Your drink has been ordered and is waiting for you at the bar.
                </div>
                <div class='mt-5 mb-1 text-center font-extrabold text-[#d3af33] text-[80px]'>
                  <span class='font-extrabold'>{drink.order_id}</span>
                </div>
                <div class='text-center text-[#9a9a9a]'>
                  <span class='font-extrabold'>Order number</span>
                </div>
              </div>
              <TipPanel thread_id={thread_id} />
            </>
          )
        }

        return (
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          <div
            class='mb-4 ml-[75px] flex flex-row justify-end gap-2.5 self-end'
            id={isLast(index) ? 'last-chat-item' : ''}
          >
            <span class='rounded-[32px_32px_0px_32px] bg-white p-3 px-6'>
              {`${message.message}`}
            </span>
            <img
              src='/public/user-logo.jpg'
              alt='User logo'
              class='h-10 w-10 rounded-full bg-white'
            />
          </div>
        )
      })}
      <script>resetScreen(60000);</script>
    </div>
  )
}
