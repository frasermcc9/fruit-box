import React from "react";
import { useHistory } from "react-router";
import useSWR from "swr";
import { apiBase, fetcher } from "../../utils/Api";
import GeneralButton from "../components/button/GeneralButton";
import LeaderBoard from "../game/Leaderboard";
import LeaderboardSection from "./LeaderboardSection";
import TimeSection from "./TimeSection";

const StatsPage: React.FC = () => {
  const history = useHistory();

  return (
    <div className="flex flex-col justify-center mt-24 items-center gap-y-8 dark:text-gray-100 mx-4 mb-24">
      <h1 className="text-6xl font-bold">Stats</h1>
      <TimeSection />
      <LeaderboardSection />
      <GeneralButton onClick={() => history.push("/")} text={"Go home"} />
    </div>
  );
};

export default StatsPage;
