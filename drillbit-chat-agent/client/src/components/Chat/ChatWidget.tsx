import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { MessageHistory } from "../../types/MessageHistory";
import { BeachBarComponent } from "../BeachBar/BeachBarComponent";
import { AppContext } from "../../App";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { websocketEmitter } from "../../utils/WebsocketEventEmitter";

const senderStyles = {
  human: "bg-white text-gray-800 rounded-[40px] rounded-br-none",
  ai: "bg-[#fff2b1] text-gray-800 rounded-[40px] rounded-bl-none",
};

const Avatar: React.FC<{ image: string; alt: string; className: string }> = ({
  image,
  alt,
  className,
}) => (
  <img
    src={`${image}`}
    alt={alt}
    className={`w-[60px] h-[60px] bg-gray-300 rounded-full border-2 ${className}`}
  />
);

export const ChatWidget: React.FC<{
  userId: string;
  threadId: string;
  messageHistory: MessageHistory;
  setMessageHistory: React.Dispatch<React.SetStateAction<MessageHistory>>;
  className: string;
}> = ({
  userId,
  threadId,
  messageHistory,
  setMessageHistory,
  className,
}) => {
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { wsConnectionStatus } = useContext(AppContext);

  // State
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const [isGeneratingImage] = useState<boolean>(false);
  const [isTypingIndicatorVisible, setIsTypingIndicatorVisible] =
    useState(false);

  useEffect(() => {
    // Focus back on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleDepositSuccess = (data: any) => {
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        messages: [...prevMessageHistory.messages, data.messages],
        extra: data.extra,
      }));
    };

    const handleDepositFailure = () => {
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        messages: [
          ...prevMessageHistory.messages,
          {
            text: "Dang, looks like something maybe went wrong when you tried to buy me that drink. Can you maybe try again?",
            sender: "ai",
          },
        ],
      }));
    };

    const handleAskDrillbitResponse = (data: any) => {
      setIsTypingIndicatorVisible(false);
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        extra: data.extra,
        messages: [...prevMessageHistory.messages, data.messages],
      }));
    };

    const handleBuyDrinkResponse = (data: any) => {
      setIsTypingIndicatorVisible(false);
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        extra: data.extra,
      }));
    };

    const handleFulfillTalentResponse = (data: any) => {
      setIsTypingIndicatorVisible(false);
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        extra: data.extra,
        messages: [...prevMessageHistory.messages, data.messages],
      }));
    };

    // Register this thread id on the server so we only get messages for this thread
    websocketEmitter.sendMessage("register", { threadId });

    // Subscribe to WebSocket events
    websocketEmitter.on("deposit-success", handleDepositSuccess);
    websocketEmitter.on("deposit-failure", handleDepositFailure);
    websocketEmitter.on("ask-drillbit-response", handleAskDrillbitResponse);
    websocketEmitter.on("buy-drink-response", handleBuyDrinkResponse);
    websocketEmitter.on("fulfill-talent-response", handleFulfillTalentResponse);

    // Cleanup event listeners on unmount
    return () => {
      websocketEmitter.off("close", () => {
        websocketEmitter.sendMessage("unregister", { threadId });
      });
      websocketEmitter.off("deposit-success", handleDepositSuccess);
      websocketEmitter.off("deposit-failure", handleDepositFailure);
      websocketEmitter.off("ask-drillbit-response", handleAskDrillbitResponse);
      websocketEmitter.off("buy-drink-response", handleBuyDrinkResponse);
      websocketEmitter.off(
        "fulfill-talent-response",
        handleFulfillTalentResponse
      );
    };
  }, [threadId, setMessageHistory]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageHistory]);

  useEffect(() => {
    // Focus back on the input field
    if (inputRef.current && !isLoading && !wsConnectionStatus) {
      inputRef.current.focus();
    }
  }, [wsConnectionStatus, isLoading]);

  // For animating chat messages
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const typingDotVariants = {
    start: { opacity: 0 },
    end: { opacity: 1, transition: { duration: 0.5, yoyo: Infinity } },
  };

  // Handle input change (to show "typing..." and hide it after 1 second)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Handle form submit (to send message to AI and hide typing...)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setMessageHistory((prevMessageHistory) => ({
      ...prevMessageHistory,
      messages: [
        ...prevMessageHistory.messages,
        { text: input, sender: "human" },
      ],
    }));

    websocketEmitter.sendMessage("ask-drillbit-request", {
      message: input,
      userId,
      threadId,
    });

    // setIsTyping(false);
    setInput("");
    setIsTypingIndicatorVisible(true);
    // setIsLoading(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div ref={chatRef} className={`flex-grow overflow-y-scroll ${className}`}>
        <div>
          {messageHistory.messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex items-end space-x-2 m-4 ${
                message.sender === "human" ? "justify-end" : "justify-start"
              }`}
              initial="hidden"
              animate="visible"
              variants={messageVariants}
              transition={{ duration: 0.3 }}
            >
              {/* AI Avatar */}
              {message.sender === "ai" && (
                <Avatar
                  image="drillbit-avatar.jpg"
                  alt="Drillbit"
                  className="border-gray-300"
                />
              )}

              <div
                className={`p-5 px-10 rounded-[20px] ${
                  senderStyles[message.sender as keyof typeof senderStyles]
                } max-w-[75%] sm:max-w-[70%] font-medium`}
              >
                {message.text}
                {message.isTyping && (
                  <span className="inline-block animate-pulse">▋</span>
                )}
                {message.image && (
                  <img
                    src={message.image}
                    alt=""
                    className="mt-2 rounded-lg w-full"
                  />
                )}
              </div>

              {/* User Avatar */}
              {message.sender === "human" && (
                <Avatar
                  image={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${userId}`}
                  alt="User"
                  className="border-blue-300"
                />
              )}
            </motion.div>
          ))}
        </div>

        {(messageHistory.extra?.msg || messageHistory.extra?.isDrinking) && (
          <div className="flex items-end space-x-2 m-5 justify-start">
            <Avatar
              image="logo192.png"
              alt="System"
              className="border-orange-300"
            />
            <div>
              {messageHistory?.extra?.checkoutUrl && (
                <>
                  <a
                    className={`p-3 rounded-lg bg-blue-600 text-white shadow block`}
                    href={messageHistory.extra.checkoutUrl}
                    target="blank"
                  >
                    {messageHistory?.extra?.msg}
                  </a>
                  <p className="text-xs text-gray-500">Powered by Payman</p>
                </>
              )}

              {messageHistory?.extra?.alcoholicDrinks && (
                <div className="mt-auto bg-white rounded-[20px] rounded-tl-none overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-600 to-red-500 text-white font-coiny text-center py-2.5 mb-[14px]">
                    Beach Bar Menu
                  </div>
                  <div className="p-[16px] pt-0">
                    {/* Beach Bar */}
                    <div className="mb-4">
                      <BeachBarComponent
                        title="Get Drillbit Drunk"
                        className="text-[#222222] font-bold text-base"
                        drinks={messageHistory.extra?.alcoholicDrinks}
                        setMessageHistory={setMessageHistory}
                        setIsTypingIndicatorVisible={
                          setIsTypingIndicatorVisible
                        }
                      />
                    </div>

                    {/* Detox Station */}
                    <div>
                      <BeachBarComponent
                        title="Sober up Drillbit"
                        className="text-[#222222] font-bold text-base"
                        drinks={messageHistory.extra?.soberingDrinks}
                        setMessageHistory={setMessageHistory}
                        setIsTypingIndicatorVisible={
                          setIsTypingIndicatorVisible
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {messageHistory?.extra?.talents && (
                <div className="mt-auto px-3 pt-2 rounded-md bg-black">
                  <h1 className="text-[#f241cc] font-bold mb-2">
                    {messageHistory?.extra?.msg}
                  </h1>
                  {/* Talent Options */}
                  <div className="mb-2">
                    <BeachBarComponent
                      title="Ask Drillbit to do something"
                      className="text-orange-300"
                      talents={messageHistory.extra?.talents}
                      setMessageHistory={setMessageHistory}
                      setIsTypingIndicatorVisible={setIsTypingIndicatorVisible}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <motion.div
            className="flex items-center space-x-2"
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              image="drillbit-avatar.jpg"
              alt="Drillbit"
              className="border-gray-300"
            />
            <div className="p-3 rounded-lg bg-white text-gray-800 shadow">
              {"..."}
            </div>
          </motion.div>
        )}

        {isTypingIndicatorVisible && (
          <div className="flex items-end space-x-2 m-4 justify-start">
            <Avatar
              image="drillbit-avatar.jpg"
              alt="Drillbit"
              className="border-gray-300"
            />
            <div className="p-3 rounded-lg bg-gray-300 text-black max-w-[75%] sm:max-w-[70%] shadow">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 bg-gray-700 rounded-full"
                    variants={typingDotVariants}
                    initial="start"
                    animate="end"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="text-sm text-gray-100 mb-2 lg:ml-20 mx-2 h-4">
        {isTyping ? "Typing..." : ""}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-row px-4 py-2 lg:mx-20 lg:mb-5 mx-2 bg-[#FFFFFF4D] rounded-full align-middle justify-center"
      >
        <input
          ref={inputRef}
          disabled={isLoading || isGeneratingImage || !wsConnectionStatus}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something to Drillbit..."
          className="text-white bg-transparent focus:outline-none flex-1 mr-[10px]"
        />
        <button
          type="submit"
          className="text-white rounded-full bg-blue-500 disabled:bg-gray-500 p-2"
          disabled={isLoading || isGeneratingImage || !wsConnectionStatus}
        >
          <SendHorizonal strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};
