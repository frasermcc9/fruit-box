import Log from "@frasermcc/log";
import { GlobalDocument, GlobalModel } from "./GlobalTypes";
import { startOfDay } from "date-fns";
import { v4 } from "uuid";

const statics = {
  async getCollection(this: GlobalModel) {
    const result = await this.findOne();
    if (!result) {
      const newGlobal = new this({
        seconds: 0,
      });
      await newGlobal.save();
      return newGlobal;
    }
    return result;
  },
};

const methods = {
  async addSeconds(this: GlobalDocument, seconds: number) {
    this.secondsUsed += seconds;
    return this.save();
  },

  async addSubmission(
    this: GlobalDocument,
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
      this.classicBoard.push({ name, score, time, layout, uuid });
    } else if (board === "blitz") {
      this.blitzBoard.push({ name, score, time, uuid });
    } else {
      Log.warn(`Unknown board: ${board}`);
    }
    await this.save();
  },

  async getSubmissions<T extends string>(
    this: GlobalDocument,
    { boards, period = "all" }: { boards: T[]; period: string }
  ): Promise<{ [K in T]?: { name: string; score: number }[] }> {
    const submissions: {
      [K in T]?: { name: string; score: number; time?: number }[];
    } = {};

    for (const board of boards) {
      const list: { name: string; score: number; time?: number }[] =
        //@ts-ignore
        this[board + "Board"];
      if (period === "all") {
        submissions[board] = list
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      } else if (period === "daily") {
        submissions[board] = list
          .filter((sub) => {
            if (!sub.time) return false;
            return (
              startOfDay(sub?.time ?? 0).getTime() ===
              startOfDay(Date.now()).getTime()
            );
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      } else {
        Log.warn(`Unknown period: ${period}`);
      }
    }
    return submissions;
  },
};

export { statics, methods };
