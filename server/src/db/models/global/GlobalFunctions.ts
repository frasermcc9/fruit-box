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
};

export { statics, methods };
