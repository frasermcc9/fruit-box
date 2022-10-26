import { model, Schema } from "mongoose";
import { statics, methods } from "./ScoreFunctions";
import { ScoreDocument, ScoreModel } from "./ScoreTypes";

const ScoreSchema = new Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  time: { type: Number, required: false },
  layout: { type: Array, required: false },
  uuid: { type: String, required: false },
});

//@ts-ignore
ScoreSchema.statics = {
  ...ScoreSchema.statics,
  ...statics,
};

//@ts-ignore
ScoreSchema.methods = {
  ...ScoreSchema.methods,
  ...methods,
};

export const ScoreCollection = model<ScoreDocument>(
  "score",
  ScoreSchema
) as ScoreModel;

export default ScoreCollection;
