import QRCode from 'qrcode'
import { CheckoutStatus } from './CheckoutStatus'

export const CheckoutLink = async ({
  url,
  status,
  thread_id,
}: {
  url: string
  status: string
  thread_id: string
}) => {
  const qrCode = await QRCode.toString(url, {
    type: 'svg',
  })

  return (
    <div
      hx-get={`/thread/${thread_id}/tip-status`}
      hx-trigger={status !== 'success' && status !== 'failed' ? 'every 3s' : ''}
      hx-swap='outerHTML scroll:#conversation:bottom'
      hx-target='#tip-container'
      class='rounded bg-[rgb(212,244,255)] p-5'
      id='tip-container'
    >
      {status?.length && status?.length > 0 ? (
        <CheckoutStatus tip_status={status} />
      ) : (
        <div class='tip-link flex flex-col items-center' id='tip-link'>
          <div class='mb-5 text-center font-bold text-base'>
            Thank you! Here's a link where you can send your USDC to the bar
            tender, via the Payman system.
          </div>
          <div class='qrcode my-10 flex w-[60%] justify-center'>
            {qrCode.replace('<svg', '<svg style="width:100%;height:100%"')}
          </div>
          <div class='flex justify-center'>
            <a
              href={url}
              target='_blank'
              rel='noreferrer'
              class='cursor-pointer rounded-lg bg-black px-5 py-2.5 text-base text-white no-underline'
            >
              Click here to pay
            </a>
          </div>
          <script>resetScreen(60000);</script>
        </div>
      )}
    </div>
  )
}
