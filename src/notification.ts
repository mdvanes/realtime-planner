export const UP_TO_DATE: string = 'Up to date';

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

  public updateAndGetTitle(titleCounter: number) {
    this.counter = titleCounter;
    return this.getTitle();
  }

}

export const notificationTitle: NotificationTitle = new NotificationTitle();
