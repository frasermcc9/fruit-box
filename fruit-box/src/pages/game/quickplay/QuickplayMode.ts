export type QuickplayMode = "blitz" | "classic";

export interface QuickplayModeDetail {
  mode: QuickplayMode;
  display: string;
}

export const quickplayArray: QuickplayModeDetail[] = [
  { display: "Normal", mode: "blitz" },
  { display: "Classic", mode: "classic" },
];
