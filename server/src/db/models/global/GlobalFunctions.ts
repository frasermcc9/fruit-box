import Log from "@frasermcc/log";
import { GlobalDocument, GlobalModel } from "./GlobalTypes";
import { startOfDay } from "date-fns";

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
    }: { name: string; score: number; board: string; time: number }
  ): Promise<void> {
    if (board === "classic") {
      this.classicBoard.push({ name, score, time });
    } else if (board === "blitz") {
      this.blitzBoard.push({ name, score, time });
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
