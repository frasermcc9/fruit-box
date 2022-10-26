import Log from "@frasermcc/log";
import GlobalCollection from "../models/global/GlobalCollection";
import ScoreCollection from "../models/score/ScoreCollection";
import { MigrationBase } from "./migration-base";

export class ClassicScoreMigration implements MigrationBase {
  async canActivate(): Promise<boolean> {
    const collection = await GlobalCollection.getCollection();
    const scores = collection.classicBoard;

    const canActivate = scores && scores.length > 0;

    Log.warn(`ClassicScoreMigration willRun: ${canActivate}`);

    return canActivate;
  }

  async exec(): Promise<void> {
    const collection = await GlobalCollection.getCollection();
    const scores = collection.classicBoard;

    for (const score of scores) {
      await ScoreCollection.addSubmission({
        board: "classic",
        layout: score.layout,
        name: score.name,
        score: score.score,
        time: score.time,
      });
    }

    collection.classicBoard = [];
    await collection.save();
  }
}
