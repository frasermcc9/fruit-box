export type QuickplayMode =
  | "blitz_daily"
  | "classic_daily"
  | "blitz"
  | "classic";

export interface QuickplayModeDetail<T> {
  mode: T;
  display: string;
}

export const quickplayArray: QuickplayModeDetail<QuickplayMode>[] = [
  { display: "Blitz (Daily)", mode: "blitz_daily" },
  { display: "Classic (Daily)", mode: "classic_daily" },
  { display: "Blitz (All)", mode: "blitz" },
  { display: "Classic (All)", mode: "classic" },
];
