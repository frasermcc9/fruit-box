import Log from "@frasermcc/log";
import { GlobalDocument, GlobalModel } from "./GlobalTypes";

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
    { name, score, board }: { name: string; score: number; board: string }
  ): Promise<void> {
    if (board === "classic") {
      this.classicBoard.push({ name, score });
    } else if (board === "blitz") {
      this.blitzBoard.push({ name, score });
    } else {
      Log.warn(`Unknown board: ${board}`);
    }
    await this.save();
  },

  async getSubmissions<T extends string>(
    this: GlobalDocument,
    ...boards: T[]
  ): Promise<{ [K in T]?: { name: string; score: number }[] }> {
    const submissions: { [K in T]?: { name: string; score: number }[] } = {};

    for (const board of boards) {
      //@ts-ignore
      const list: { name: string; score: number }[] = this[board + "Board"];
      const top10 = list.sort((a, b) => b.score - a.score).slice(0, 10);
      submissions[board] = top10;
    }
    return submissions;
  },
};

export { statics, methods };
