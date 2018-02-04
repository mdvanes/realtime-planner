import * as Rx from 'rxjs/Rx';
import { notificationTitle } from './notification';
import observeWsUpdates from './updateObserver';

observeWsUpdates();

function observeWindowFocus() {
  const subject = Rx.Observable.fromEvent(document, 'visibilitychange');

  subject.subscribe(_ => {
    if (!document.hidden) {
      document.title = notificationTitle.resetAndGetTitle();
    }
  });
}
observeWindowFocus();
