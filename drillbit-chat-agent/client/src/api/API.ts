import type { Message } from "../types/Message";
import type { MessageHistory } from "../types/MessageHistory";
import type { Metrics } from "../types/Metrics";

const BASE_URL = "https://drillbit-agent.onrender.com/api";

const START_CONVERSATION = "/start?thread_id=";
const RESET_STATE = "/reset-state?thread_id=";
const FETCH_METRICS = "/metrics";

// ***** Start a new conversation *****
export const startConversation = async (
  user_id: string,
  thread_id: string,
  responseCallback: (result: MessageHistory) => void,
  errorCallback: (error: Message) => void
) => {
  try {
    const response = await fetch(
      BASE_URL + START_CONVERSATION + thread_id + `&handle=${user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    responseCallback(await response.json());
  } catch (e) {
    errorCallback(mapError(e as Error));
  }
};

export const resetState = async (_: string, thread_id: string) => {
  try {
    const response = await fetch(BASE_URL + RESET_STATE + thread_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {}
};

// ***** Fetch metrics *****
export const getMetrics = async (
  responseCallback: (result: Metrics) => void,
  _: (error: string) => void
) => {
  try {
    const response = await fetch(
      BASE_URL + FETCH_METRICS,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    responseCallback(await response.json());
  } catch (e) {
    responseCallback({
      totalDrinks: 0,
      totalSoberingDrinks: 0,
      maxDrunkReached: 0,
      totalRevenue: 0,
    });
  }
};

const mapError = (error: Error) => {
  const msg =
    error instanceof Error
      ? error.message
      : "Whoa, dude! My brain's a bit fried right now. Can you repeat that?";
  const errorMessage: Message = {
    text: msg,
    sender: "ai",
  };

  return errorMessage;
};
