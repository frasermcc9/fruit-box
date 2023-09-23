import Log from "@frasermcc/log";
import GlobalCollection from "../models/global/GlobalCollection";
import ScoreCollection from "../models/score/ScoreCollection";
import { MigrationBase } from "./migration-base";

export class DeleteCheatedScoresMigration implements MigrationBase {
  async canActivate(): Promise<boolean> {
    const collection = await GlobalCollection.getCollection();
    const scores = collection.classicBoard;

    const canActivate = scores && scores.length > 0;

    Log.warn(`DeleteCheatedScoresMigration willRun: ${canActivate}`);

    return canActivate;
  }

  async exec(): Promise<void> {
    const collection = await GlobalCollection.getCollection();
    const scores = collection.classicBoard;
    for (const score of scores) {
      const { uuid, score: scoreNum } = score;

      if (uuid === undefined) {
        continue;
      }

      if (scoreNum <= 200) {
        continue;
      }

      await ScoreCollection.deleteSubmissions({ uuid });
    }

    collection.classicBoard = [];
    await collection.save();
  }
}
