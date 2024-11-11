import type { DrinkOrder } from "@/storage";

export const OrderList = ({ orders }: { orders: DrinkOrder[] }) => {
  return (
    <>
      {orders.map((order) => {
        return (
          <li class="bg-[#f1f1f1] mx-2.5 my-2.5 p-4 rounded flex justify-between items-center gap-8 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            <div>
              <div class="text-base">
                Order <strong>{order.id}</strong> at
                {` ${order.timestamp?.toString()}`}
                <br />
                Drink: <strong>{order.drink_name}</strong>
              </div>
              <div class="text-sm mt-1.5 leading-[1.4]">
                Instructions:
                <br />
                {order.instructions}
              </div>
            </div>
            <form
              class="m-0"
              hx-post={`/order/${order.id}/complete`}
              hx-target="#order-list"
              hx-swap="innerHTML"
            >
              <button
                id="send-btn"
                class="bg-[#ef6f1c] hover:bg-[#ff7f2a] text-white border-none py-1.5 px-2.5 rounded-lg cursor-pointer h-[50px] text-base font-bold w-[180px]"
                type="submit"
              >
                Confirm
              </button>
            </form>
          </li>
        );
      })}
      {orders.length === 0 && (
        <div class="text-center text-lg text-[#ccc] mt-[50px]">
          No orders at the moment
        </div>
      )}
    </>
  );
};
