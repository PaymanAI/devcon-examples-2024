import { ErrorIcon } from './ErrorIcon'
import { Loading } from './Loading'
import { SuccessIcon } from './SuccessIcon'

export const CheckoutStatus = async ({
  tip_status,
}: {
  tip_status?: string
}) => {
  let message = ''
  let finished = false
  if (tip_status === 'success') {
    message =
      'Thank you! Your tip has been received successfully by the bartender!'
    finished = true
  } else if (tip_status === 'failed') {
    message = 'There was an error processing your tip. Please try again.'
    finished = true
  } else if (tip_status === 'pending') {
    message =
      'Your tip is being processed. Please wait a moment while we confirm your payment.'
  }

  return (
    <div class='flex items-center justify-start gap-5'>
      <div class='flex h-20 w-20 items-center'>
        {finished ? (
          tip_status === 'success' ? (
            <SuccessIcon />
          ) : (
            <ErrorIcon />
          )
        ) : (
          <Loading className='h-20 w-20 self-center' />
        )}
      </div>
      <div class='text-left font-bold text-base'>{message}</div>
      {finished && (
        <button
          type='button'
          onclick='resetScreen(0)'
          class='cursor-pointer rounded-lg bg-black px-2.5 py-1.5 text-sm text-white leading-[1.4]'
        >
          New Chat
        </button>
      )}
      {<script>resetScreen(60000);</script>}
    </div>
  )
}
