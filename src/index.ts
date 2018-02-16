import * as Rx from 'rxjs/Rx'; // TODO only import what is needed (test build size difference)
import { notificationTitle } from './notification';
import observeWsUpdates from './updateObserver';

observeWsUpdates();

function setTitle() {
  if (!document.hidden) {
    document.title = notificationTitle.resetAndGetTitle();
  }
}

function observeWindowFocus() {
  // visibilitychange for tab changes, window.onfocus for window changes
  const subject = Rx.Observable.fromEvent(document, 'visibilitychange');
  subject.subscribe(setTitle);
  window.onfocus = setTitle;
}
observeWindowFocus();
