// @ts-ignore
import { Card, CardContent } from "../ui/card";
import { Message } from "../../types/Message";
import React, { useContext, useEffect, useState } from "react";

import { startConversation as startConversationAPI } from "../../api/API";

import { MessageHistory } from "../../types/MessageHistory";
import { ChatWidget } from "../Chat/ChatWidget";
import { AppContext } from "../../App";

const initialMessageHistory = {
  messages: [],
  message_count: 0,
};
export const BeachBarTab: React.FC<{}> = () => {
  // const [drunkLevel, setDrunkLevel] = useState(0);
  const [messageHistory, setMessageHistory] = useState<MessageHistory>(
    initialMessageHistory
  );

  const { twitterAuth } = useContext(AppContext);
  const { user, threadId } = twitterAuth;

  const updateMessageHistory = (msg: Message) => {
    setMessageHistory((prevMessageHistory) => ({
      ...prevMessageHistory,
      messages: [...prevMessageHistory.messages, msg],
    }));
  };

  useEffect(() => {
    startConversationAPI(
      user?.reloadUserInfo.screenName,
      threadId,
      (result: MessageHistory) => {
        setMessageHistory(result);
      },
      (error) => updateMessageHistory(error)
    );
  }, []);

  return (
    <Card className="bg-gradient-to-r shadow-none py-3 flex flex-col flex-grow max-h-[100%]">
      <CardContent className="flex-grow flex flex-row overflow-y-scroll">
        {/* Chat widget */}

        <ChatWidget
          userId={user?.reloadUserInfo.screenName}
          threadId={threadId}
          messageHistory={messageHistory}
          className="rounded-t-lg bg-opacity-75"
          setMessageHistory={setMessageHistory}
        />
      </CardContent>
    </Card>
  );
};