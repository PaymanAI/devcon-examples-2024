import { Loading } from './Loading'

export const TipPanel = ({ thread_id }: { thread_id: string }) => (
  <div class='rounded bg-[rgb(212,244,255)] p-5' id='tip-container'>
    <div class='htmx-request:hidden'>
      <div class='mb-5 text-center font-bold text-base'>
        Want to tip your bartender?
      </div>
      <div class='flex justify-center gap-5'>
        <button
          type='button'
          class='cursor-pointer rounded-lg bg-black px-2.5 py-1.5 text-sm text-white leading-[1.4]'
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
          class='cursor-pointer rounded-lg bg-black px-2.5 py-1.5 text-sm text-white leading-[1.4]'
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
          class='cursor-pointer rounded-lg bg-black px-2.5 py-1.5 text-sm text-white leading-[1.4]'
          hx-post={`/thread/${thread_id}/tip/5`}
          hx-trigger='click'
          hx-target='#tip-container'
          hx-swap='outerHTML scroll:#conversation:bottom'
          hx-indicator='#tip-container'
        >
          5 USDC
        </button>
        <button
          type='button'
          class='cursor-pointer rounded-lg bg-black px-2.5 py-1.5 text-sm text-white leading-[1.4]'
          onclick='refresh()'
        >
          No Thanks
        </button>
      </div>
    </div>
    <Loading className='htmx-request:block hidden h-20 w-20 self-center' />
  </div>
)
