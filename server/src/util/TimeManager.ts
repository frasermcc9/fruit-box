type TimeManagerFunction = () => void;

export class TimeManager {
  private interval?: NodeJS.Timeout;

  constructor(
    private readonly fn: TimeManagerFunction,
    private readonly runAfter: number
  ) {}

  begin() {
    this.interval = setInterval(this.fn, this.runAfter);
  }

  resetTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.begin();
  }

  end() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
