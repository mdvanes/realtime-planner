import { bind } from 'hyperhtml/esm';
import { Observable } from 'rxjs/Rx';
import { Appointment } from './Appointment';
import './LatestTweet';
import { notificationTitle } from './notification';
import { doInitRender, doNextRender, renderControls } from './renderHelpers';
import vTable from './vTable';

let appointmentsVTable: vTable = null;
let clientId: string = null;

export default function initWsStream() {
  // Implementation conform state store pattern - http://reactivex.io/rxjs/manual/tutorial.html#state-stores
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
        ],
        titleCounter: !document.hasFocus() ? ++state.titleCounter : 0
      });
    });

  // const visibilityChange$ = Observable.fromEvent(document, 'visibilitychange')
  //   .map(() => state => {
  //     return Object.assign({}, state, {
  //       titleCounter: !document.hasFocus() ? state.titleCounter : 0
  //     });
  //   });

  const documentFocus$ = Observable.fromEvent(window, 'focus').map(
    () => state => {
      return Object.assign({}, state, {
        titleCounter: !document.hasFocus() ? state.titleCounter : 0
      });
    }
  );

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

  const tweet$ = ws$
    .filter((message: any) => message.type === 'tweet')
    .map((message: any) => state => {
      return Object.assign({}, state, {
        lastTweet: message.tweet
      });
    });

  // TODO implement delete message

  // Setting the initial state before receiving the initial server state
  const state$ = Observable.merge(
    init$,
    add$,
    auto$,
    lock$,
    documentFocus$,
    tweet$
  ).scan((state: any, changeFn) => changeFn(state), {
    appointments: [],
    clientId: '',
    isAuto: false,
    lastTweet: null,
    titleCounter: 0
  });

  state$.subscribe(
    (state: any) => {
      setClientId(state.clientId);
      renderControls(state.isAuto, (payload: string) => {
        ws$.next(payload); // TODO is there no better way than to supply ws$ here? -> dispatch
      });
      // TODO vTable has no purpose anymore? Do sort here?
      appointmentsVTable = new vTable(state.appointments);
      doNextRender(appointmentsVTable);
      document.title = notificationTitle.updateAndGetTitle(state.titleCounter);
      if (state.lastTweet) {
        renderLastTweet(bind(document.querySelector('#last-tweet')), state);
      }
    },
    err => console.error('an error on state$', err), // tslint:disable-line
    () => console.log('state$ completed') // tslint:disable-line
  );

  doInitRender((payload: string) => {
    ws$.next(payload);
  });
  /* TODO automatically re-connect web socket if server restarts and get state -
   https://gearheart.io/blog/auto-websocket-reconnection-with-rxjs/
   */
}

function renderLastTweet(render, state) {
  // Hyper does not like "partial attributes", e.g. href="https://twitter.com/x/status/${state.lastTweet.id_str}">
  // const href = 'https://twitter.com/x/status/'+ state.lastTweet.id_str;
  // render`<a href="${href}">"${state.lastTweet.text}" by ${state.lastTweet.username} ${state.lastTweet.id_str}</a>`;
  const latestTweetElem = document.querySelector('latest-tweet');
  latestTweetElem.setAttribute('tweet-info', JSON.stringify(state.lastTweet));
}

function setClientId(id) {
  document.getElementById('clientId').innerHTML = id;
  clientId = id;
}
