export class Player {
  name: string;
  ready: boolean;
  host: boolean;
  room?: string;

  constructor(name: string, host?: boolean) {
    this.name = name;
    this.ready = false;
    this.host = host ?? false;
  }
}
