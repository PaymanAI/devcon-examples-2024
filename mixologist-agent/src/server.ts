import { staticPlugin } from "@elysiajs/static";
import { HumanMessage } from "@langchain/core/messages";
import { Elysia, t } from "elysia";
import { v4 as uuidv4 } from "uuid";
import { index } from "../frontend";
import { bartender } from "../frontend/bartender";
import { OrderList } from "../frontend/fragments/OrderList";
import { app } from "./graph";
import { renderChatWindow, renderCheckoutLink } from "./renderers";
import {
  completeOrder,
  getAllOpenOrders,
  getOrderByThreadsId,
  getTotalDrinkOrders,
  getTotalPaid,
  updateTipAmount,
  updateTipStatus,
} from "./storage";
import { createCustomerDeposit } from "./tools";
import { cors } from "@elysiajs/cors";

export const server = new Elysia()
  .use(
    staticPlugin({
      assets: "./frontend/static",
    })
  )
  // configure cors
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .post("/start", async () => {
    const thread_id = uuidv4();
    const state = await app.invoke(
      {
        messages: [],
      },
      { configurable: { thread_id } }
    );
    return renderChatWindow(state, thread_id);
})
  .post(
    "/thread/:id",
    async ({ body, params: { id } }) => {
      const config = {
        configurable: { thread_id: id },
      };

      await app.updateState(
        config,
        {
          messages: [new HumanMessage(body.message)],
        },
        "user_input"
      );
      await app.invoke(null, config);

      const state = await app.getState(config);
      return renderChatWindow(state.values, id);
    },
    {
      body: t.Object({
        message: t.String(),
      }),
    }
  )
  .post(
    "/webhook",
    async ({ body: { eventType, details } }) => {
      switch (eventType) {
        case "customer-deposit.pending": {
          const thread_id = details?.metadata?.thread_id;
          const order = await getOrderByThreadsId(thread_id);
          await updateTipStatus(order.id, "pending");
          break;
        }
        case "customer-deposit.failed": {
          const thread_id = details?.metadata?.thread_id;
          const order = await getOrderByThreadsId(thread_id);
          await updateTipStatus(order.id, "failed");
          break;
        }
        case "customer-deposit.successful": {
          const thread_id = details?.metadata?.thread_id;
          const order = await getOrderByThreadsId(thread_id);
          await updateTipStatus(order.id, "success");
        }
      }
    },
    {
      body: t.Object({
        eventType: t.String(),
        details: t.Any(),
      }),
    }
  )
  .get("/thread/:id", async ({ params: { id } }) => {
    const config = { configurable: { thread_id: id } };
    const state = await app.getState(config);
    return renderChatWindow(state.values, id);
  })
  .get("/", async () => {
    const html = await index();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  })
  .get("/tips", async () => {
    const balance = await getTotalPaid();
    return new Response(balance.toFixed(2), {
      headers: { "Content-Type": "text/plain" },
    });
  })
  .get("/count", async () => {
    const count = await getTotalDrinkOrders();
    return new Response(count?.toString() ?? "0", {
      headers: { "Content-Type": "text/plain" },
    });
  })
  .get("/bartender", async () => {
    const html = await bartender();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  })
  .get("/orders", async () => {
    const orders = await getAllOpenOrders();
    const html = await OrderList({ orders });
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  })
  .post("/order/:id/complete", async ({ params }) => {
    await completeOrder(Number(params.id));
    const orders = await getAllOpenOrders();
    const html = await OrderList({ orders });
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  })
  .get("/thread/:id/tip-status", async ({ params }) => {
    const order = await getOrderByThreadsId(params.id);
    return renderCheckoutLink(
      order.link ?? "",
      order.tip_status ?? "",
      params.id
    );
  })
  .post("/thread/:id/tip/:amount", async ({ params }) => {
    const amount = Number(params.amount);
    const link = await createCustomerDeposit({ thread_id: params.id, amount });
    const order = await getOrderByThreadsId(params.id);
    await updateTipAmount(order.id, amount, link);
    return renderCheckoutLink(link, "", params.id);
  });
