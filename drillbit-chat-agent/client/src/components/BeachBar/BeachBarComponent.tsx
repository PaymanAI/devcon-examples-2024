import React, { useContext } from "react";
import { Drink } from "../../types/Drink";
// @ts-ignore
import Coin from "../../assets/svg/Coin.svg";

import { MessageHistory } from "../../types/MessageHistory";
import { Talent } from "../../types/Talent";
import { AppContext } from "../../App";
import { websocketEmitter } from "../../utils/WebsocketEventEmitter";

export const BeachBarComponent: React.FC<{
  className: string;
  title: string;
  drinks?: Drink[];
  talents?: Talent[];
  setMessageHistory: React.Dispatch<React.SetStateAction<MessageHistory>>;
  setIsTypingIndicatorVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  className,
  title,
  drinks,
  talents,
  setMessageHistory,
  setIsTypingIndicatorVisible,
}) => {
  const { twitterAuth } = useContext(AppContext);
  const { user, threadId } = twitterAuth;

  const buyDrink = (drink: Drink) => {
    setMessageHistory((prevMessageHistory) => ({
      ...prevMessageHistory,
      extra: undefined,
      messages: [
        ...prevMessageHistory.messages,
        { text: "Sure. Let me buy you a " + drink.name, sender: "human" },
      ],
    }));
    setIsTypingIndicatorVisible(true);

    // Emit WebSocket event to buy drink
    websocketEmitter.sendMessage("buy-drink-request", {
      drink,
      userId: user?.displayName,
      threadId,
    });
  };

  const requestEntertainment = (talent: Talent) => {
    setMessageHistory((prevMessageHistory) => ({
      ...prevMessageHistory,
      extra: undefined,
      messages: [
        ...prevMessageHistory.messages,
        { text: "Alright, " + talent.name, sender: "human" },
      ],
    }));
    setIsTypingIndicatorVisible(true);

    // Emit WebSocket event to request entertainment
    websocketEmitter.sendMessage("fulfill-talent-request", {
      talent,
      userId: user?.displayName,
      threadId,
    });
  };

  return (
    <div className="">
      <p className={`${className}`}>{title}</p>
      <div className="flex flex-wrap gap-2.5 mt-1">
        {/* Drinks Menu */}
        {drinks &&
          drinks.map((drink) => (
            <div
              key={drink.name}
              onClick={() => buyDrink(drink)}
              className="cursor-pointer text-white text-sm  transition-all"
            >
              <div className="rounded-lg w-[70px] h-[140px] flex flex-col border-2 border-[#EAEAE] drop-shadow-lg hover:border-[#e57931] hover:bg-[#e5c0a8]">
                <div className="flex gap-1  p-2.5">
                  <img src={Coin} alt="currency" />
                  <span className="text-black">{drink?.price}</span>
                </div>
                <div className="flex flex-1 justify-end items-end">
                  <img src={drink.icon} alt="drink" />
                </div>
              </div>
              <div className="text-[#737373] font-semibold mt-1">
                {drink?.name}
              </div>
            </div>
          ))}

        {/* Talents */}
        {talents &&
          talents.map((talent) => (
            <div
              key={talent.name}
              onClick={() => requestEntertainment(talent)}
              className="cursor-pointer text-white text-sm rounded-lg transition-all duration-300 transform"
            >
              <div className="rounded-lg w-[70px] flex flex-col p-[5px] text-center justify-center border-2 border-[#EAEAE] drop-shadow-lg hover:border-[#e57931] hover:bg-[#e5c0a8]">
                <div className="flex flex-1 justify-center">
                  <img src={talent.icon} alt="talent" />
                </div>
                <div className="text-[#737373] text-center font-medium mt-1">
                  {talent?.name}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
