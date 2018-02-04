import * as Rx from 'rxjs/Rx';
import { notificationTitle } from './notification';
import * as partial from './partials';

export default function observeAppointmentsChanges() {
  const subject = Rx.Observable.webSocket('ws://localhost:9001');
  subject.retry().subscribe(
    msg => {
      // const x = JSON.stringify(JSON.parse(msg));
      console.log('message received: ' + msg, msg);
      const result: any = msg;

      if (result.id) {
        // Receiving an id
        setClientId(result.id);
      } else {
        // Update of state
        // TODO not result.length > 0, but updates > 0 (msg pushed does not mean appointments added) - reactive way to
        // compare previous to current appointments.length?
        if (
          !document.hasFocus() &&
          result.appointments &&
          result.appointments.length > 0
        ) {
          // TODO it is probably bad practice to set this in two places (also in observeWindowFocus)
          document.title = notificationTitle.addAndGetTitle();
        } else {
          document.title = notificationTitle.resetAndGetTitle();
        }

        // console.log(result.foo);
        render(subject, result);
      }
    },
    err => console.log(err),
    () => console.log('complete')
  );
  // subject.next(JSON.stringify({ message: 'Msg from browser' }));

  /* TODO automatically re-connect web socket if server restarts and get state -
   https://gearheart.io/blog/auto-websocket-reconnection-with-rxjs/
   */
}

function setClientId(id) {
  document.getElementById('clientId').innerHTML = id;
}

// TODO add typing for "state", i.e. it should have an "appointments" property
function render(wsSubject, state) {
  const output =
    partial.renderButton() +
    ' ' +
    partial.renderToggle(state.auto) +
    '<div class="mdl-layout-spacer"></div><br/>' +
    partial.renderTable(state.appointments);
  document.getElementById('target').innerHTML = output;
  subscribeToButtonClicks(wsSubject);
}

function subscribeToButtonClicks(wsSubject) {
  const buttonAdd = document.getElementById('button-add');
  const buttonAddObs = Rx.Observable.fromEvent(buttonAdd, 'click');

  buttonAddObs.subscribe(_ =>
    wsSubject.next(JSON.stringify({ message: 'add' }))
  );

  const buttonAuto = document.getElementById('button-auto');
  const buttonAutoObs = Rx.Observable.fromEvent(buttonAuto, 'click');

  buttonAutoObs.subscribe(_ =>
    wsSubject.next(JSON.stringify({ message: 'auto' }))
  );
}
