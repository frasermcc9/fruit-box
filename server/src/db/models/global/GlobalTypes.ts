import { Model, Document } from "mongoose";

export interface GlobalProps {
  secondsUsed: number;
  blitzBoard: { name: string; score: number; time?: number; uuid?: string }[];
  classicBoard: {
    name: string;
    score: number;
    time?: number;
    layout?: number[];
    uuid?: string;
  }[];
}
export interface GlobalDocument extends GlobalProps, Document {
  addSeconds(this: GlobalDocument, seconds: number): Promise<void>;
}
export interface GlobalModel extends Model<GlobalDocument> {
  getCollection(this: GlobalModel): Promise<GlobalDocument>;
}
