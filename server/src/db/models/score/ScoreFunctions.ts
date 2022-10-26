import Log from "@frasermcc/log";
import { ScoreDocument, ScoreModel } from "./ScoreTypes";
import { startOfDay } from "date-fns";
import { v4 } from "uuid";

const statics = {
  async addSubmission(
    this: ScoreModel,
    {
      name,
      score,
      board,
      time,
      layout,
    }: {
      name: string;
      score: number;
      board: string;
      time: number;
      layout: number[];
    }
  ): Promise<void> {
    const uuid = v4();
    if (board === "classic") {
      await this.create({
        name,
        score,
        time,
        layout,
        uuid,
      });
    } else if (board === "blitz") {
    }
  },

  async getSubmissions<T extends "blitz" | "classic">(
    this: ScoreModel,
    { boards, period = "all" }: { boards: T[]; period: "all" | "daily" }
  ): Promise<{ [K in T]?: { name: string; score: number }[] }> {
    const submissions: {
      [K in T]?: { name: string; score: number; time?: number }[];
    } = {};

    for (const board of boards) {
      if (board === "blitz") {
        submissions[board] = [];
      } else if (board === "classic") {
        submissions[board] = await this.find(
          {
            time: {
              $gte: period === "daily" ? startOfDay(new Date()).getTime() : 0,
            },
          },
          {},
          { limit: 10, sort: { score: -1 } }
        );
      }
    }
    return submissions;
  },
};

const methods = {};

export { statics, methods };
