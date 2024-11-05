import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trophy } from "lucide-react";
import { getLeaderboard as getLeaderboardAPI } from "../../api/API";
import { LeaderboardPlayer } from "../../types/LeaderboardPlayer";

const LeaderboardTab: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  useEffect(() => {
    getLeaderboardAPI(
      (leaderboard) => setLeaderboard(leaderboard),
      (error) => console.error(error)
    );
  }, []);

  return (
    <Card className="bg-gradient-to-br from-yellow-400 to-red-500 shadow-lg rounded-2xl overflow-y-auto">
      <CardHeader className="p-6">
        <CardTitle className="px-8 text-3xl text-white">
          <Trophy className="inline-block mr-2 h-8 w-8" />
          Top Beach Bums
        </CardTitle>
      </CardHeader>
      <CardContent className="md:px-12 px-3 pt-0">
        <ul className="divide-y divide-yellow-300">
          {leaderboard.map((player: LeaderboardPlayer, index: number) => (
            <li
              key={index}
              className="px-6 py-3 flex justify-between md:text-lg text-md text-white"
            >
              <span className="font-semibold">{index + 1}.</span>
              <span className="font-semibold">{player.name}</span>
              <span className="font-semibold">{player.drinks} drinks</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export { LeaderboardTab };
