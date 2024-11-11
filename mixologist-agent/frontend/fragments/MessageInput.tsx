import { isAIMessage } from "@langchain/core/messages";
import type { ChatWindowProps } from "./ChatWindow";
import { SendIcon } from "./SendButton";

export const MessageInput = ({
  messages,
  thread_id,
  isFinished,
}: ChatWindowProps) => {
  let trigger = "load delay:20s";
  const lastMessageWasHuman =
    !!messages?.length && !isAIMessage(messages[messages.length - 1]);
  let postEndpoint = undefined;
  let getEndpoint = undefined;

  if (!isFinished) {
    if (lastMessageWasHuman) {
      trigger = "load delay:3s";
      postEndpoint = undefined;
      getEndpoint = `/thread/${thread_id}`;
    } else {
      trigger = "submit";
      postEndpoint = `/thread/${thread_id}`;
      getEndpoint = undefined;
    }
  }

  return (
    <>
      <form
        class="flex absolute bottom-0 rounded-[40px] h-[50px] bg-white/30 px-5 py-2.5 right-10 left-10"
        hx-post={postEndpoint}
        hx-get={getEndpoint}
        hx-target="#result"
        hx-swap="innerHTML scroll:#conversation:bottom"
        hx-ext="json-enc"
        hx-trigger={trigger}
      >
        <input
          type="text"
          id="user-input"
          name="message"
          disabled={!postEndpoint}
          placeholder="Type your message"
          class="flex-grow px-2.5 py-2.5 border-0 mr-2.5 bg-transparent text-white text-base h-[30px] 
        placeholder:opacity-80 placeholder:text-white
        focus:outline-none focus:border-0
        disabled:placeholder:opacity-80 disabled:placeholder:text-[#ccc]"
        />
        <button
          id="send-btn"
          type="submit"
          disabled={!postEndpoint}
          hx-indicator="#spinner"
          class="bg-transparent p-0 hover:bg-transparent disabled:opacity-80 disabled:cursor-default 
        [&_.hide-on-request]:text-[#68F0FF] 
        disabled:[&_.hide-on-request]:text-[#ccc]
        disabled:[&_.hide-on-request]:cursor-default"
        >
          <svg
            id="spinner"
            class="hidden transition-[display] duration-500 ease-in mx-auto htmx-request:block"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <title>Loading</title>
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity="0.25"
            />
            <circle cx="12" cy="2.5" r="1.5" fill="currentColor">
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </circle>
          </svg>
          <span class="htmx-request:hidden">
            <SendIcon />
          </span>
        </button>
      </form>
    </>
  );
};
