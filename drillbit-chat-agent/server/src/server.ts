import { cors } from "@elysiajs/cors";
import {
  AIMessage,
  type BaseMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { isAIMessage } from "@langchain/core/messages";
import { START, type StateSnapshot } from "@langchain/langgraph";
import { Elysia, t } from "elysia";
import { talents } from "./config";
import { graph } from "./graph";
import { START_STATE } from "./state";
import type { WSMessage } from "./types/Socket";
import { Currency, MetricsRow, StorageClient } from "./utils/StorageClient";

const db: StorageClient = new StorageClient();

function getUpdatedDrunkLevel(drunkLevel: number, details: any) {
  const soberEffect = Number(details.metadata.drinkSoberEffect) || 0;
  const alcoholContent = Number(details.metadata.drinkAlcoholContent) || 0;

  if (!isNaN(soberEffect) && soberEffect > 0) {
    drunkLevel = drunkLevel - soberEffect;
  } else if (!isNaN(alcoholContent) && alcoholContent > 0) {
    drunkLevel = drunkLevel + alcoholContent;
  }

  drunkLevel = Math.max(0, Math.min(25, drunkLevel));
  return drunkLevel;
}

// ****  Map graph state to chat messages ****
function mapStateToMessages(graphState: StateSnapshot) {
  const result = {
    messages: graphState.values.messages.map((msg: BaseMessage) => ({
      [(msg.content as string).startsWith("https") &&
      !(msg.content as string).startsWith("https://app")
        ? "image"
        : "text"]: msg.content,
      sender: isAIMessage(msg) ? "ai" : "human",
    })),
    message_count: graphState.values.message_count,
    extra: graphState.values.extra,
  };

  return result;
}

// ****  Format messages ****
function mapResultToMessages(result: any) {
  const response = result.messages.map((msg: BaseMessage) => ({
    [(msg.content as string).startsWith("https") &&
    !(msg.content as string).startsWith("https://app")
      ? "image"
      : "text"]: msg.content,
    sender: isAIMessage(msg) ? "ai" : "human",
  }));

  return response;
}

// ****  Fetch and return last message only ****
function mapLastResultToMessages(result: any) {
  const lastMessage = result.messages[result.messages.length - 1];
  const response = {
    [(lastMessage.content as string).startsWith("https") &&
    !(lastMessage.content as string).startsWith("https://app")
      ? "image"
      : "text"]: lastMessage.content,
    sender: isAIMessage(lastMessage) ? "ai" : "human",
  };

  return response;
}

export const fetchMetrics = async () => {
  const response = await db.getMetricsByCurrency(Bun.env.CURRENCY || "USD");
  if (response) {
    return {
      totalDrinks: response.totalDrinks,
      totalSoberingDrinks: response.totalSoberingDrinks,
      maxDrunkReached: response.maxDrunkLevel,
      totalRevenue: (
        Number(response.totalEarned) /
        10 ** response.decimals
      ).toFixed(response.decimals),
    };
  } else {
    return {
      totalDrinks: 0,
      totalSoberingDrinks: 0,
      maxDrunkReached: 0,
      totalRevenue: 0,
    };
  }
};

const askDrillbit = async (body: any) => {
  const message = body.message!;
  const thread_id = body.threadId;
  const metrics = await fetchMetrics();
  const config = {
    configurable: { thread_id, drunkLevel: metrics.maxDrunkReached },
  };

  try {
    await graph.updateState(
      config,
      {
        messages: [new HumanMessage(message)],
        message_count: 1,
        extra: {},
      },
      "user_input"
    );
  } catch (e) {
    console.log(e);
  }

  // Explicitly invoke to move the state to the next node.
  const result = await graph.invoke(null, config);
  const payload = {
    eventType: "ask-drillbit-response",
    data: {
      messages: mapLastResultToMessages(result),
      message_count: result.message_count,
      extra: { ...result.extra, drunkLevel: metrics.maxDrunkReached },
    },
  };
  broadcastMessage(thread_id, payload);
};

const buyDrink = async (body: any) => {
  const drink = body.drink!;
  const thread_id = body.threadId;
  const user_id = body.userId;
  const metrics = await fetchMetrics();

  const config = { configurable: { thread_id, drunkLevel: metrics.maxDrunkReached } };

  try {
    await graph.updateState(
      config,
      {
        messages: [new HumanMessage("Sure. Let me buy you a " + drink.name)],
        message_count: 1,
        customer_id: user_id,
        extra: {
          paidDrink: drink,
        },
      },
      "ask_for_drink"
    );
  } catch (e) {
    console.log(e);
  }

  // Explicitly invoke to move the state to the next node.
  const result = await graph.invoke(null, config);
  const payload = {
    eventType: "buy-drink-response",
    data: {
      messages: mapLastResultToMessages(result),
      message_count: result.message_count,
      extra: { ...result.extra, drunkLevel: metrics.maxDrunkReached },
    },
  };

  broadcastMessage(thread_id, payload);
};

const fulfillTalentRequest = async (body: any) => {
  const talent_request = body.talent!;
  const thread_id = body.threadId;
  const user_id = body.userId;
  const metrics = await fetchMetrics();

  const config = { configurable: { thread_id, drunkLevel: metrics.maxDrunkReached } };

  try {
    await graph.updateState(
      config,
      {
        messages: [new HumanMessage("Alright, " + talent_request.name)],
        message_count: 1,
        customer_id: user_id,
        extra: {
          talentReq: talent_request,
          drunkLevel: metrics.maxDrunkReached
        },
      },
      "wait_to_entertain"
    );
  } catch (e) {
    console.log(e);
  }

  // Explicitly invoke to move the state to the next node.
  const result = await graph.invoke(null, config);
  const payload = {
    eventType: "fulfill-talent-response",
    data: {
      messages: mapLastResultToMessages(result),
      message_count: result.message_count,
      extra: { ...result.extra, drunkLevel: metrics.maxDrunkReached },
    },
  };

  broadcastMessage(thread_id, payload);
};

const websockets = new Map<string, string>();
const clients = new Map<string, (message: WSMessage) => void>();

export const server = new Elysia()
  // configure cors
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  // **** WebSocket connection support ****
  .ws("/ws", {
    open: (ws) => {},
    message: (ws, message: any) => {
      if (message.eventType === "register") {
        const threadId = message.data.threadId ?? "unknown";
        websockets.set(ws.id, threadId);
        clients.set(threadId, (message: WSMessage) => {
          ws.raw.send(JSON.stringify(message));
        });
      }
      if (message.eventType === "unregister") {
        const threadId = message.data.threadId ?? "unknown";
        websockets.delete(threadId);
        clients.delete(threadId);
      } else if (message.eventType === "ask-drillbit-request") {
        askDrillbit(message.data);
      } else if (message.eventType === "buy-drink-request") {
        buyDrink(message.data);
      } else if (message.eventType === "fulfill-talent-request") {
        fulfillTalentRequest(message.data);
      }
    },
    close: (ws) => {
      for (const [key, value] of websockets.entries()) {
        if (key === ws.id) {
          websockets.delete(key);
          clients.delete(value);
        }
      }
    },
  })
  // **** 1. get the graph state ****
  .get("/api/get-graph-state", async ({ query: { thread_id } }) => {
    return await graph.getState({ configurable: { thread_id } });
  })
  // **** 2. start the graph ****
  .post("/api/start", async ({ query: { thread_id, handle = "dude" } }) => {
    const metrics = await fetchMetrics();
    const config = { configurable: { thread_id, drunkLevel: metrics.maxDrunkReached } };
    const graphState = await graph.getState(config);

    if (
      graphState.values?.messages?.length !== undefined &&
      graphState.values.messages.length !== 0
    ) {
      return mapStateToMessages(graphState);
    }

    const result = await graph.invoke(
      {
        messages: [
          new AIMessage(
            `Hey @${handle}, what brings you to the sunny side of life?`
          ),
        ],
      },
      { configurable: { thread_id } }
    );

    return {
      messages: mapResultToMessages(result),
      thread_id,
    };
  })
  // **** 3. handle webhooks ****
  .post(
    "/api/webhook",
    async ({ body: { eventType, details } }) => {
      switch (eventType) {
        case "customer-deposit.successful": {
          const thread_id = details?.metadata?.thread_id;
          const metrics = await db.getMetricsByCurrency(details.currency);

          const config = { configurable: { thread_id,  drunkLevel: metrics?.maxDrunkLevel } };
          await graph.updateState(
            config,
            {
              extra: {
                isDrinking: true,
                talents: talents,
              },
            },
            "wait_for_money"
          );
          await graph.invoke(null, config);

          const state = await graph.getState(config);

          // Upsert into database
          
          if (metrics) {
            const updatedDrunkLevel = getUpdatedDrunkLevel(
              metrics.maxDrunkLevel,
              details
            );

            var soberDrinks = metrics.totalSoberingDrinks;
            if (details.metadata.drinkSoberEffect) {
              soberDrinks += 1;
            }

            try {
              // Create new MetricsRow with incremented drinks
              const updatedMetrics = new MetricsRow(
                metrics.totalDrinks + 1, // Increment drinks
                soberDrinks,
                updatedDrunkLevel,
                BigInt(metrics.totalEarned) + BigInt(details.amount),
                metrics.currency
              );

              await db.upsertMetrics(updatedMetrics);
            } catch (e) {
              console.log("failed to upsert metrics", e);
            }
          } else {
            const updatedDrunkLevel = getUpdatedDrunkLevel(0, details);

            var soberDrinks = 0;
            if (details.metadata.drinkSoberEffect) {
              soberDrinks = 1;
            }

            // Handle case where no metrics exist for USD
            const newMetrics = new MetricsRow(
              1,
              soberDrinks,
              updatedDrunkLevel,
              BigInt(details.amount),
              (Bun.env.CURRENCY || "USD") as Currency
            );
            await db.upsertMetrics(newMetrics);
          }

          broadcastMessage(thread_id, {
            eventType: "deposit-success",
            data: {
              messages: mapLastResultToMessages(state.values),
              message_count: state.values.message_count,
              extra: state.values.extra,
            },
          });

          break;
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
  // **** 4. reset state ****
  .post("/api/reset-state", async ({ query: { thread_id } }) => {
    const config = { configurable: { thread_id } };

    await graph.updateState(config, START_STATE, START);
    const graphState = await graph.getState({ configurable: { thread_id } });

    if (
      graphState.values?.messages?.length !== undefined &&
      graphState.values.messages.length !== 0
    ) {
      return mapStateToMessages(graphState);
    }
  })
  .get("/api/metrics", async () => {
    return await fetchMetrics();
  });

// Function to broadcast a message to all connected clients
export const broadcastMessage = (threadId: string, message: WSMessage) => {
  const send = clients.get(threadId);
  if (send) {
    send(message);
  }
};
