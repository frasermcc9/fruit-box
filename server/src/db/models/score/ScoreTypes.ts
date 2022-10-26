import { Model, Document } from "mongoose";

export interface ScoreProps {
  name: string;
  score: number;
  time?: number;
  layout?: number[];
  uuid?: string;
}

export interface ScoreDocument extends ScoreProps, Document {}
export interface ScoreModel extends Model<ScoreDocument> {
  addSubmission(
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
      time?: number;
      layout?: number[];
    }
  ): Promise<void>;
  getSubmissions<T extends string>(
    this: ScoreModel,
    { boards, period }: { boards: T[]; period: string }
  ): Promise<{ [K in T]?: { name: string; score: number }[] }>;
}
