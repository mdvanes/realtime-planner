export const UP_TO_DATE: string = 'Up to date';

// TODO convert to do this without state

class NotificationTitle {
  private counter: number;

  constructor() {
    this.counter = 0;
  }

  public getTitle() {
    if (this.counter === 0) {
      return UP_TO_DATE;
    } else {
      return `New (${this.counter})`;
    }
  }

  public addAndGetTitle() {
    this.add();
    return this.getTitle();
  }

  public resetAndGetTitle() {
    this.reset();
    return this.getTitle();
  }

  private add() {
    this.counter++;
  }

  private reset() {
    this.counter = 0;
  }
}

export const notificationTitle: NotificationTitle = new NotificationTitle();
