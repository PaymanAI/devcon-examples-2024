import type { BaseMessage } from "@langchain/core/messages";
import { ChatHistory } from "./ChatHistory";
import { MessageInput } from "./MessageInput";

export interface ChatWindowProps {
  messages: BaseMessage[];
  isFinished: boolean;
  thread_id: string;
}

export const ChatWindow = async ({
  messages,
  thread_id,
  isFinished,
}: ChatWindowProps) => (
  <div class="overflow-hidden px-5 pt-5 pb-0">
    <ChatHistory messages={messages} thread_id={thread_id} />
    <MessageInput
      thread_id={thread_id}
      isFinished={isFinished}
      messages={messages}
    />
  </div>
);
