import { Loading } from './Loading'

export const TipPanel = ({ thread_id }: { thread_id: string }) => (
  <div class="bg-[rgb(212,244,255)] p-5 rounded" id="tip-container">
  <div class="htmx-request:hidden">
    <div class="text-base mb-5 font-bold text-center">
      Want to tip your bartender?
    </div>
    <div class="flex justify-center gap-5">
      <button
        type="button"
        class="text-sm leading-[1.4] py-1.5 px-2.5 rounded-lg cursor-pointer bg-black text-white"
        hx-post={`/thread/${thread_id}/tip/1`}
        hx-trigger="click"
        hx-target="#tip-container"
        hx-swap="outerHTML scroll:#conversation:bottom"
        hx-indicator="#tip-container"
      >
        1 USDC
      </button>
      <button
        type="button"
        class="text-sm leading-[1.4] py-1.5 px-2.5 rounded-lg cursor-pointer bg-black text-white"
        hx-post={`/thread/${thread_id}/tip/2`}
        hx-trigger="click"
        hx-target="#tip-container"
        hx-swap="outerHTML scroll:#conversation:bottom"
        hx-indicator="#tip-container"
      >
        2 USDC
      </button>
      <button
        type="button"
        class="text-sm leading-[1.4] py-1.5 px-2.5 rounded-lg cursor-pointer bg-black text-white"
        hx-post={`/thread/${thread_id}/tip/5`}
        hx-trigger="click"
        hx-target="#tip-container"
        hx-swap="outerHTML scroll:#conversation:bottom"
        hx-indicator="#tip-container"
      >
        5 USDC
      </button>
      <button 
        type="button"
        class="text-sm leading-[1.4] py-1.5 px-2.5 rounded-lg cursor-pointer bg-black text-white"
        onclick="refresh()"
      >
        No Thanks
      </button>
    </div>
  </div>
  <Loading className="w-20 h-20 self-center hidden htmx-request:block" />
</div>
)
