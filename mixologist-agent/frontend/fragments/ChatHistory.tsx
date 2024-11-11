import type { BaseMessage } from "@langchain/core/messages";
import { isAIMessage } from "@langchain/core/messages";
import { Marked } from "@ts-stack/markdown";
import { TipPanel } from "./TipPanel";

export const ChatHistory = ({
  messages,
  thread_id,
}: {
  messages: BaseMessage[];
  thread_id: string;
}) => {
  const filteredMessages = messages
    .filter((message) => message.content?.length)
    .map((message) => {
      if (isAIMessage(message)) {
        const content = Marked.parse(`${message.content}`);
        return {
          type: "ai",
          message: content,
        };
      }

      if (message._getType() === "tool") {
        return {
          type: "tool",
          message: JSON.parse(`${message.content}`),
        };
      }
      return {
        type: "user",
        message: `${message.content}`,
      };
    });

  const isLast = (index: number) => index === filteredMessages.length - 1;

  return (
    <div
      class="scroll-smooth overflow-scroll h-[calc(100%-170px)]"
      id="conversation"
    >
      {filteredMessages.map((message, index) => {
        if (message.type === "ai") {
          return (
            <div
              class="self-start flex flex-row gap-2.5 justify-start mr-[75px] mb-4"
              id={isLast(index) ? "last-chat-item" : ""}
            >
              <span class="flex">
                <img
                  src="/public/buzzed-logo.png"
                  alt="Buzzed Lightbeer"
                  class="w-20 h-20 rounded-full bg-white"
                />
              </span>
              {index < filteredMessages.length - 1 ? (
                <span class="p-3 px-6 rounded-[54px_54px_54px_0px] bg-[rgb(212,244,255)]">
                  {message.message}
                </span>
              ) : (
                <>
                  <span class="hidden" id="typing-source">
                    {message.message}
                  </span>
                  <span
                    class="p-3 px-6 rounded-[54px_54px_54px_0px] bg-[rgb(212,244,255)]"
                    id="simulateWithTyping"
                  />
                  <script>simulateTyping();</script>
                </>
              )}
            </div>
          );
        }

        if (message.type === "tool") {
          const drink = message.message;
          return (
            <>
              <div class="self-start flex flex-row gap-2.5 justify-start mr-[75px] mb-4">
                <span class="flex">
                  <img
                    src="/public/buzzed-logo.png"
                    alt="Buzzed Lightbeer"
                    class="w-20 h-20 rounded-full bg-white"
                  />
                </span>
                <span class="p-3 px-6 rounded-[54px_54px_54px_0px] bg-[rgb(212,244,255)]">
                  Coming right up!
                </span>
              </div>
              <div
                class="w-[300px] rounded-[0px_27px_27px_27px] bg-black mb-4 relative p-10"
                id={isLast(index) ? "last-chat-item" : ""}
              >
                <img
                  src="/public/buzzed-logo.png"
                  alt="Buzzed light beer"
                  class="absolute top-0 right-0 opacity-30 w-[120px] h-[120px]"
                />
                <div class="text-2xl font-extrabold leading-[31.25px] text-white">
                  {drink.drink}
                </div>
                <div class="text-xs font-semibold leading-4 text-left max-w-[200px] mb-4 text-[#9a9a9a] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.35)]">
                  Your drink has been ordered and is waiting for you at the bar.
                </div>
                <div class="text-center text-[#d3af33] mt-5 mb-1 text-[80px] font-extrabold">
                  <span class="font-extrabold">{drink.order_id}</span>
                </div>
                <div class="text-center text-[#9a9a9a]">
                  <span class="font-extrabold">Order number</span>
                </div>
              </div>
              <TipPanel thread_id={thread_id} />
            </>
          );
        }

        return (
          <div
            class="self-end flex flex-row gap-2.5 justify-end ml-[75px] mb-4"
            id={isLast(index) ? "last-chat-item" : ""}
          >
            <span class="p-3 px-6 rounded-[40px_40px_0px_40px] bg-white">
              {`${message.message}`}
            </span>
            <span class="flex">
              <img
                src="/public/user-logo.jpg"
                alt="User logo"
                class="w-20 h-20 rounded-full bg-white"
              />
            </span>
          </div>
        );
      })}
      <script>resetScreen(60000);</script>
    </div>
  );
};
