import { isAIMessage } from '@langchain/core/messages'
import type { ChatWindowProps } from './ChatWindow'
import { SendIcon } from './SendButton'

export const MessageInput = ({
  messages,
  thread_id,
  isFinished,
}: ChatWindowProps) => {
  let trigger = 'load delay:20s'
  const lastMessageWasHuman =
    !!messages?.length && !isAIMessage(messages[messages.length - 1])
  let postEndpoint = undefined
  let getEndpoint = undefined

  if (!isFinished) {
    if (lastMessageWasHuman) {
      trigger = 'load delay:3s'
      postEndpoint = undefined
      getEndpoint = `/thread/${thread_id}`
    } else {
      trigger = 'submit'
      postEndpoint = `/thread/${thread_id}`
      getEndpoint = undefined
    }
  }

  return (
    <>
      <form
        class='chat-input'
        hx-post={postEndpoint}
        hx-get={getEndpoint}
        hx-target='#result'
        hx-swap='innerHTML scroll:#conversation:bottom'
        hx-ext='json-enc'
        hx-trigger={trigger}
      >
        <input
          type='text'
          id='user-input'
          name='message'
          disabled={!postEndpoint}
          placeholder='Type your message'
        />
        <button
          id='send-btn'
          type='submit'
          disabled={!postEndpoint}
          hx-indicator='#spinner'
        >
          <svg
            id='spinner'
            class='htmx-indicator'
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
          >
            <title>Loading</title>
            <path
              fill='currentColor'
              d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
              opacity='0.25'
            />
            <circle cx='12' cy='2.5' r='1.5' fill='currentColor'>
              <animateTransform
                attributeName='transform'
                dur='0.75s'
                repeatCount='indefinite'
                type='rotate'
                values='0 12 12;360 12 12'
              />
            </circle>
          </svg>
          <span class='hide-on-request'>
            <SendIcon />
          </span>
        </button>
      </form>
    </>
  )
}
