export enum Classic {
  CREATE = 'ws_CreateClassic',
}

export interface ClassicTypes {
  [Classic.CREATE]: { apples: number[] };
}
