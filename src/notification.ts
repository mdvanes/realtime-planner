export const UP_TO_DATE: string = 'Up to date';

// TODO convert to do this without state

class NotificationTitle {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  add() {
    this.counter++;
  }

  reset() {
    this.counter = 0;
  }

  getTitle() {
    if (this.counter === 0) {
      return UP_TO_DATE;
    } else {
      return `New (${this.counter})`;
    }
  }

  addAndGetTitle() {
    this.add();
    return this.getTitle();
  }

  resetAndGetTitle() {
    this.reset();
    return this.getTitle();
  }
}

export const notificationTitle: NotificationTitle = new NotificationTitle();
