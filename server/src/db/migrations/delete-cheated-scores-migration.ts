import Log from "@frasermcc/log";
import GlobalCollection from "../models/global/GlobalCollection";
import ScoreCollection from "../models/score/ScoreCollection";
import { MigrationBase } from "./migration-base";

export class DeleteCheatedScoresMigration implements MigrationBase {
  async canActivate(): Promise<boolean> {
    const collection = await ScoreCollection.getSubmissions({
      boards: ["classic"],
      period: "all",
    });
    const scores = collection.classic;

    const canActivate =
      (scores?.some((score) => score.score > 200) ||
        scores?.some((score) => score.score === 197)) ??
      false;

    Log.warn(`DeleteCheatedScoresMigration willRun: ${canActivate}`);

    return canActivate;
  }

  async exec(): Promise<void> {
    const collection = await ScoreCollection.getSubmissions({
      boards: ["classic"],
      period: "all",
    });

    const scores = collection.classic;

    if (scores === undefined) {
      return;
    }

    for (const score of scores) {
      const { score: scoreNum, uuid } = score;

      if (uuid === undefined) {
        continue;
      }

      if (scoreNum === 197) {
        await ScoreCollection.deleteSubmissions({ uuid });
        continue;
      }

      if (scoreNum >= 200) {
        await ScoreCollection.deleteSubmissions({ uuid });
      }
    }
  }
}
