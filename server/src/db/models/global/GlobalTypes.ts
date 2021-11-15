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
  addSubmission(
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
  ): Promise<void>;
  getSubmissions<T extends string>(
    this: GlobalDocument,
    { boards, period }: { boards: T[]; period: string }
  ): Promise<{ [K in T]?: { name: string; score: number }[] }>;
}
export interface GlobalModel extends Model<GlobalDocument> {
  getCollection(this: GlobalModel): Promise<GlobalDocument>;
}
