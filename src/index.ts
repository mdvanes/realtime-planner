import * as Rx from 'rxjs/Rx';
import { notificationTitle } from './notification';
// import {connectableObservableDescriptor} from "rxjs/observable/ConnectableObservable";

// Rx.Observable
//     .of(1,2,3)
//     .map(x => x + '!!!')
//     .subscribe(x => console.log('Observable of array', x));

function observeAppointmentsChanges() {
  const subject = Rx.Observable.webSocket('ws://localhost:9001');
  subject.retry().subscribe(
    msg => {
      // const x = JSON.stringify(JSON.parse(msg));
      console.log('message received: ' + msg, msg);
      const result: any = msg;

      // TODO not result.length > 0, but updates > 0 (msg pushed does not mean appointments added)
      if (!document.hasFocus() && result.appointments && result.appointments.length > 0) {
        // TODO it is probably bad practice to set this in two places (also in observeWindowFocus)
        document.title = notificationTitle.addAndGetTitle();
      } else {
        document.title = notificationTitle.resetAndGetTitle();
      }

      // console.log(result.foo);
      render(result);
    },
    err => console.log(err),
    () => console.log('complete')
  );
  //subject.next(JSON.stringify({ message: 'Msg from browser' }));

  // TODO automatically re-connect web socket if server restarts and get state - https://gearheart.io/blog/auto-websocket-reconnection-with-rxjs/

  // TODO add typing for "state", i.e. it should have an "appointments" property
  function render(state) {
    const output = renderButton() + ' ' + renderToggle(state.auto) + '<div class="mdl-layout-spacer"></div><br/>' + renderTable(state.appointments);
    document.getElementById('target').innerHTML = output;
    document.getElementById('button-add').addEventListener('click', add);
    document.getElementById('button-auto').addEventListener('click', autoToggle);
  }

  function add() {
    subject.next(JSON.stringify({ message: 'add' }));
  }

  function autoToggle() {
    subject.next(JSON.stringify({ message: 'auto' }));
  }
}
observeAppointmentsChanges();

function observeWindowFocus() {
  const subject = Rx.Observable.fromEvent(document, 'visibilitychange');

  subject.subscribe(function(e) {
    if (!document.hidden) {
      document.title = notificationTitle.resetAndGetTitle();
    }
  });
}
observeWindowFocus();

function renderButton() {
  return `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="button-add">
        <i class="material-icons">add</i>
    </button>`;
}

function renderToggle(isAuto: boolean) {
  // return `<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
  //   <input type="checkbox" id="switch-1" class="mdl-switch__input" checked>
  //   <span class="mdl-switch__label"></span>
  // </label>`;
  let classNames = 'mdl-button mdl-js-button mdl-button--raised';
  if(isAuto) {
    classNames += ' mdl-button--colored';
  }
  return `<button class="${classNames}" id="button-auto">
        auto ${isAuto}
    </button>`;
}

function renderTable(apts) {
  return `<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
${apts.map(renderRow).join('')}
</table>`;
}

function renderRow(apt) {
  return `<tr>
    <td>${apt.date}</td>
    <td>${apt.firstName} ${apt.lastName}</td>
    <td>${apt.phone || ''}</td>
    <td>${apt.email}</td>
  </tr>`;
}
