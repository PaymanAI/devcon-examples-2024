import React from "react";
import { Drink } from "../../types/Drink";
import { Talent } from "../../types/Talent";

export const BeachBarItem = ({
  drink,
  talent,
}: {
  drink?: Drink;
  talent?: Talent;
}) => {
  return (
    <>
      {/* {drink ? (
        <span className="text-sm text-black">
          {drink.icon} {drink.name}
        </span>
      ) : (
        <span className="text-sm text-black">
          {talent!.icon} {talent!.name}
        </span>
      )} */}
    </>
  );
};
