import Log from "@frasermcc/log";
import mongoose from "mongoose";

let database: mongoose.Connection;

export const connect = () => {
  const uri = "mongodb://localhost:27017";
  const dbName = "applegame";

  if (database) {
    return;
  }

  mongoose.connect(uri, {
    dbName: dbName,
  });
  database = mongoose.connection;

  database.once("open", async () => {
    Log.info("Database connection established.");
  });

  database.on("error", () => {
    console.warn("Error connecting to database");
  });

  return;
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
  console.log("Closed database");
};
