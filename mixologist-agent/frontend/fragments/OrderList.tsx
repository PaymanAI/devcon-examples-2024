import type { DrinkOrder } from '@/storage'

export const OrderList = ({ orders }: { orders: DrinkOrder[] }) => {
  return (
    <>
      {orders.map(order => {
        return (
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          <li class='mx-2.5 my-2.5 flex items-center justify-between gap-8 rounded bg-[#f1f1f1] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.3)]'>
            <div>
              <div class='text-base'>
                Order <strong>{order.id}</strong> at
                {` ${order.timestamp?.toString()}`}
                <br />
                Drink: <strong>{order.drink_name}</strong>
              </div>
              <div class='mt-1.5 text-sm leading-[1.4]'>
                Instructions:
                <br />
                {order.instructions}
              </div>
            </div>
            <form
              class='m-0'
              hx-post={`/order/${order.id}/complete`}
              hx-target='#order-list'
              hx-swap='innerHTML'
            >
              <button
                id='send-btn'
                class='h-[50px] w-[180px] cursor-pointer rounded-lg border-none bg-[#ef6f1c] px-2.5 py-1.5 font-bold text-base text-white hover:bg-[#ff7f2a]'
                type='submit'
              >
                Confirm
              </button>
            </form>
          </li>
        )
      })}
      {orders.length === 0 && (
        <div class='mt-[50px] text-center text-[#ccc] text-lg'>
          No orders at the moment
        </div>
      )}
    </>
  )
}
