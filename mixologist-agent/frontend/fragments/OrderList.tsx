import type { DrinkOrder } from '@/storage'

export const OrderList = ({ orders }: { orders: DrinkOrder[] }) => {
  return (
    <>
      {orders.map(order => {
        return (
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          <li class='order-item'>
            <div class='order-details'>
              <div class='order-title'>
                Order <strong>{order.id}</strong> at
                {` ${order.timestamp?.toString()}`}
                <br />
                Drink: <strong>{order.drink_name}</strong>
              </div>
              <div class='order-instructions'>
                Instructions:
                <br />
                {order.instructions}
              </div>
            </div>
            <form
              hx-post={`/order/${order.id}/complete`}
              hx-target='#order-list'
              hx-swap='innerHTML'
            >
              <button id='send-btn' class='confirm-btn' type='submit'>
                Confirm
              </button>
            </form>
          </li>
        )
      })}
      {orders.length === 0 && (
        <div class='no-orders'>No orders at the moment</div>
      )}
    </>
  )
}
