import { Observable } from 'rxjs/Rx';
import { Appointment } from './Appointment';
import { notificationTitle } from './notification';
import { doInitRender, doNextRender, renderControls } from './renderHelpers';
import vTable from './vTable';

let appointmentsVTable: vTable = null;
let clientId: string = null;

// function processAddMessage(message: any) {
//   appointmentsVTable.add(message.appointment);
//   doNextRender(appointmentsVTable);
//   updateTitle();
// }
//
// function processLockMessage(message: any) {
//   appointmentsVTable.lock(message.forAptId, message.byClientId);
//   doNextRender(appointmentsVTable);
// }

export default function initWsStream() {
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
  /** Implementation conform "filter type" pattern **/
  // const ws$ = Observable.webSocket('ws://localhost:9001');
  // const init$ = ws$
  //   .filter((message: any) => message.type === 'init')
  //   .map((initMessage: any) => {
  //     // Receiving the initial state, including the ID
  //     setClientId(initMessage.id);
  //     renderControls(initMessage, (payload: string) => {
  //       ws$.next(payload); // TODO is there no better way than to supply ws$ here?
  //     });
  //     appointmentsVTable = new vTable(initMessage.appointments);
  //     doInitRender(appointmentsVTable, (payload: string) => {
  //       ws$.next(payload);
  //     });
  //   })
  //   .first(); // closes the subscription after completion
  //
  // const add$ = ws$
  //   .filter((message: any) => message.type === 'add')
  //   .map(processAddMessage);
  //
  // const lock$ = ws$
  //   .filter(
  //     (message: any) =>
  //       message.type === 'lock' && message.byClientId !== clientId
  //   )
  //   .map(processLockMessage);
  //
  // const auto$ = ws$
  //   .filter((message: any) => message.type === 'auto')
  //   .map((message: any) => {
  //     renderControls(message, (payload: string) => {
  //       ws$.next(payload);
  //     });
  //   });
  //
  // // Avoid multiple subscriptions
  // Observable.merge(init$, add$, lock$, auto$)
  //   // retry(10) ?
  //   .subscribe(
  //     msg => {
  //       // TODO still needed?
  //     },
  //     err => console.log(err),
  //     () => console.log('complete')
  //   );
  /** Implementation conform state store pattern - http://reactivex.io/rxjs/manual/tutorial.html#state-stores **/
  const ws$ = Observable.webSocket('ws://localhost:9001');

  const init$ = ws$
    .filter((message: any) => message.type === 'init')
    .map((message: any) => state => {
      // Receiving the initial state, including the ID
      return Object.assign({}, state, {
        appointments: message.appointments,
        clientId: message.id,
        isAuto: message.auto
      });
      // setClientId(initMessage.id);
      // renderControls(initMessage, (payload: string) => {
      //   ws$.next(payload); // TODO is there no better way than to supply ws$ here?
      // });
      // appointmentsVTable = new vTable(initMessage.appointments);
      // doInitRender(appointmentsVTable, (payload: string) => {
      //   ws$.next(payload);
      // });
    })
    .first(); // closes the subscription after completion

  const add$ = ws$
    .filter((message: any) => message.type === 'add')
    .map((message: any) => state => {
      // TODO get rid of this side effect -> make "title" a property in state
      updateTitle();
      // Not inline:
      // const newAppointments = state.appointments.map((apt: Appointment) => {
      //   delete apt.isAdded;
      //   return apt;
      // });
      // message.appointment.isAdded = true;
      // return Object.assign({}, state, {
      //   appointments: [message.appointment, ...newAppointments]
      // });
      // Mostly inline, but not necessarily readable:
      message.appointment.isAdded = true;
      return Object.assign({}, state, {
        appointments: [
          message.appointment,
          ...state.appointments.map((apt: Appointment) => {
            delete apt.isAdded;
            return apt;
          })
        ]
      });
    });

  const lock$ = ws$
    .filter(
      (message: any) =>
        message.type === 'lock' && message.byClientId !== clientId
    )
    .map((message: any) => state => {
      const newAppointments = state.appointments.map((apt: Appointment) => {
        apt.isLocked = apt.aptId.toString() === message.forAptId;
        apt.byClientId = message.byClientId;
        delete apt.isAdded;
        // TODO instead of duplicating this logic for each event type, auto remove isAdded after the effect has run
        return apt;
      });
      return Object.assign({}, state, {
        appointments: newAppointments
      });
    });

  const auto$ = ws$
    .filter((message: any) => message.type === 'auto')
    .map((message: any) => state =>
      Object.assign({}, state, {
        appointments: [
          ...state.appointments.map((apt: Appointment) => {
            delete apt.isAdded;
            // TODO instead of duplicating this logic for each event type, auto remove isAdded after the effect has run
            return apt;
          })
        ],
        isAuto: message.isAuto
      })
    );

  // TODO implement delete message

  // Setting the initial state before receiving the initial server state
  const state$ = Observable.merge(init$, add$, auto$, lock$).scan(
    (state: any, changeFn) => changeFn(state),
    {
      appointments: [],
      clientId: '',
      isAuto: false
    }
  );

  state$.subscribe(
    (state: any) => {
      setClientId(state.clientId);
      renderControls(state.isAuto, (payload: string) => {
        ws$.next(payload); // TODO is there no better way than to supply ws$ here? -> dispatch
      });
      // TODO vTable has no purpose anymore? Do sort here?
      appointmentsVTable = new vTable(state.appointments);
      doNextRender(appointmentsVTable);
    },
    err => console.error('an error on state$', err),
    () => console.log('state$ completed')
  );

  doInitRender((payload: string) => {
    ws$.next(payload);
  });
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
