import { Model, Document } from "mongoose";

export interface GlobalProps {
  secondsUsed: number;
  blitzBoard: { name: string; score: number }[];
  classicBoard: { name: string; score: number }[];
}
export interface GlobalDocument extends GlobalProps, Document {
  addSeconds(this: GlobalDocument, seconds: number): Promise<void>;
  addSubmission(
    this: GlobalDocument,
    { name, score, board }: { name: string; score: number; board: string }
  ): Promise<void>;
  getSubmissions<T extends string>(
    this: GlobalDocument,
    ...boards: T[]
  ): Promise<{ [K in T]?: { name: string; score: number }[] }>;
}
export interface GlobalModel extends Model<GlobalDocument> {
  getCollection(this: GlobalModel): Promise<GlobalDocument>;
}
