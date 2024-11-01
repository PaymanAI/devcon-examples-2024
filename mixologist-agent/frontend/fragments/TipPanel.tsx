import { Loading } from './Loading'

export const TipPanel = ({ thread_id }: { thread_id: string }) => (
  <div class='tip' id='tip-container'>
    <div class='hide-on-request'>
      <div class='message'>Want to tip your bartender?</div>
      <div class='tip-buttons'>
        <button
          type='button'
          hx-post={`/thread/${thread_id}/tip/1`}
          hx-trigger='click'
          hx-target='#tip-container'
          hx-swap='outerHTML scroll:#conversation:bottom'
          hx-indicator='#tip-container'
        >
          1 USDC
        </button>
        <button
          type='button'
          hx-post={`/thread/${thread_id}/tip/2`}
          hx-trigger='click'
          hx-target='#tip-container'
          hx-swap='outerHTML scroll:#conversation:bottom'
          hx-indicator='#tip-container'
        >
          2 USDC
        </button>
        <button
          type='button'
          hx-post={`/thread/${thread_id}/tip/5`}
          hx-trigger='click'
          hx-target='#tip-container'
          hx-swap='outerHTML scroll:#conversation:bottom'
          hx-indicator='#tip-container'
        >
          5 USDC
        </button>
        <button type='button' onclick='refresh()'>
          No Thanks
        </button>
      </div>
    </div>
    <Loading className='htmx-indicator' />
  </div>
)
