import { Observable } from 'rxjs/Rx'; // TODO test build size difference between import * as Rx and import {Observable}
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
  const subject = Observable.fromEvent(document, 'visibilitychange');
  subject.subscribe(setTitle);
  window.onfocus = setTitle;
}
observeWindowFocus();
