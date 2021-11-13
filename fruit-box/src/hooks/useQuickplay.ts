import React from "react";
import { createStatefulContext } from "@frasermcc/stateful-context";
import { Entity } from "../pages/game/quickplay/modifier";

export declare type SetFunction<KeyType> = React.Dispatch<
  React.SetStateAction<KeyType>
>;

export interface QuickplayContext {
  board: Entity[];
  timerPaused: boolean;
  startTime: number;
  endTime: number;
}

const [useQuickplay, QuickplayContextProvider] =
  createStatefulContext<QuickplayContext>({
    board: [],
    timerPaused: false,
    startTime: Date.now(),
    endTime: Date.now(),
  });

export { useQuickplay, QuickplayContextProvider };
