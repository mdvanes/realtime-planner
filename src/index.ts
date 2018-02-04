import * as Rx from 'rxjs/Rx';
import observeAppointmentsChanges from './appointmentChanges';
import { notificationTitle } from './notification';

observeAppointmentsChanges();

function observeWindowFocus() {
  const subject = Rx.Observable.fromEvent(document, 'visibilitychange');

  subject.subscribe(_ => {
    if (!document.hidden) {
      document.title = notificationTitle.resetAndGetTitle();
    }
  });
}
observeWindowFocus();
