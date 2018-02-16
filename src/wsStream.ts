import { Observable } from 'rxjs/Rx';
import { notificationTitle } from './notification';
import {
  doInitRender,
  doNextRender,
  renderControls
} from './renderHelpers';
import vTable from './vTable';

let appointmentsVTable: vTable = null;
let clientId: string = null;

function processAddMessage(message: any) {
  appointmentsVTable.add(message.appointment);
  doNextRender(appointmentsVTable);
  updateTitle();
}

function processLockMessage(message: any) {
  appointmentsVTable.lock(message.forAptId, message.byClientId);
  doNextRender(appointmentsVTable);
}

export default function initWsStream() {
  const ws$ = Observable.webSocket('ws://localhost:9001');
  /*
  // Manage subscriptions manually / imperatively.
  //const init$ = subject
  //  .filter(x => x.type === 'init')
  //init$.subscribe()
  const add$ = subject.filter(x => x.type === 'add')
  add$.subscribe()
  etc ...

  // Anti pattern to have a lot of subscribe()
  const add$ = subject.filter(x => x.type === 'add')
    .map(handle the thingy)

  const lock$ = ...
  const stream$ = Rx.observable.merge(add$, lock$, .).subscribe()

  // Init is an exception, because happens once
  const init$ = subject.filter(x => x.type === 'add')
    .map(handle the thingy)
    .first()
   */

  const init$ = ws$
    .filter((message: any) => message.type === 'init')
    .map((initMessage: any) => {
      // Receiving the initial state, including the ID
      setClientId(initMessage.id);
      renderControls(initMessage, (payload: string) => {
        ws$.next(payload); // TODO is there no better way than to supply ws$ here?
      });
      appointmentsVTable = new vTable(initMessage.appointments);
      doInitRender(appointmentsVTable, (payload: string) => {
        ws$.next(payload);
      });
    })
    .first(); // closes the subscription after completion

  const add$ = ws$
    .filter((message: any) => message.type === 'add')
    .map(processAddMessage);

  const lock$ = ws$
    .filter((message: any) => message.type === 'lock' && message.byClientId !== clientId)
    .map(processLockMessage);

  const auto$ = ws$
    .filter((message: any) => message.type === 'auto')
    .map((message: any) => {
      renderControls(message, (payload: string) => {
        ws$.next(payload);
      });
    });

  // TODO better dates, and sorting by date/time
  // TODO implement delete message

  // Avoid multiple subscriptions
  Observable
    .merge(init$, add$, lock$, auto$)
    // retry(10) ?
    .subscribe(
        msg => {
          // TODO still needed?
        },
        err => console.log(err),
        () => console.log('complete')
    );

  /* TODO automatically re-connect web socket if server restarts and get state -
   https://gearheart.io/blog/auto-websocket-reconnection-with-rxjs/
   */
}

function setClientId(id) {
  document.getElementById('clientId').innerHTML = id;
  clientId = id;
}

function updateTitle() {
  // Update of state
  if (!document.hasFocus()) {
    // TODO it is probably bad practice to set this in two places (also in observeWindowFocus)
    document.title = notificationTitle.addAndGetTitle();
  } else {
    document.title = notificationTitle.resetAndGetTitle();
  }
}
