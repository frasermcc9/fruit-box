import { model, Schema } from "mongoose";
import { statics, methods } from "./GlobalFunctions";
import { GlobalDocument, GlobalModel } from "./GlobalTypes";

const GlobalSchema = new Schema({
  secondsUsed: { type: Number, required: true, default: 0 },
  blitzBoard: { type: Array, default: [], required: true },
  classicBoard: { type: Array, default: [], required: true },
});

//@ts-ignore
GlobalSchema.statics = {
  ...GlobalSchema.statics,
  ...statics,
};

//@ts-ignore
GlobalSchema.methods = {
  ...GlobalSchema.methods,
  ...methods,
};

export const GlobalCollection = model<GlobalDocument>(
  "global",
  GlobalSchema
) as GlobalModel;

export default GlobalCollection;
