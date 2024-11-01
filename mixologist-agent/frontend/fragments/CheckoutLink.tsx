import QRCode from 'qrcode'
import { CheckoutStatus } from './CheckoutStatus'

export const CheckoutLink = async ({
  url,
  status,
  thread_id,
}: { url: string; status: string; thread_id: string }) => {
  const qrCode = await QRCode.toString(url, {
    type: 'svg',
  })

  return (
    <div
      hx-get={`/thread/${thread_id}/tip-status`}
      hx-trigger={status !== 'success' && status !== 'failed' ? 'every 3s' : ''}
      hx-swap='outerHTML scroll:#conversation:bottom'
      hx-target='#tip-container'
      class='tip'
      id='tip-container'
    >
      {status?.length && status?.length > 0 ? (
        <CheckoutStatus tip_status={status} />
      ) : (
        <div class='tip-link' id='tip-link'>
          <div class='message'>
            Thank you! Here's a link where you can send your USDC to the bar
            tender, via the Payman system.
          </div>
          <div class='qrcode'>{qrCode}</div>
          <div class='link'>
            <a href={url} target='_blank' rel='noreferrer'>
              Click here to pay
            </a>
          </div>
          <script>resetScreen(60000);</script>
        </div>
      )}
    </div>
  )
}
