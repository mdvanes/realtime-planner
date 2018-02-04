import * as Rx from 'rxjs/Rx';
import { notificationTitle } from './notification';
import * as partial from './partials';

export default function updateAppointments(state, send) {
  // Update of state
  // TODO not result.length > 0, but updates > 0 (msg pushed does not mean appointments added) - reactive way to
  // compare previous to current appointments.length?
  if (
    !document.hasFocus() &&
    state.appointments &&
    state.appointments.length > 0
  ) {
    // TODO it is probably bad practice to set this in two places (also in observeWindowFocus)
    document.title = notificationTitle.addAndGetTitle();
  } else {
    document.title = notificationTitle.resetAndGetTitle();
  }

  // console.log(result.foo);
  render(state, send);
}

// TODO add typing for "state", i.e. it should have an "appointments" property
function render(state, send) {
  const output =
    partial.renderButton() +
    ' ' +
    partial.renderToggle(state.auto) +
    '<div class="mdl-layout-spacer"></div><br/>' +
    partial.renderTable(state.appointments);
  document.getElementById('target').innerHTML = output;
  subscribeToButtonClicks(send);
}

function subscribeToButtonClicks(send) {
  const buttonAdd = document.getElementById('button-add');
  const buttonAddObs = Rx.Observable.fromEvent(buttonAdd, 'click');

  buttonAddObs.subscribe(_ => send(JSON.stringify({ message: 'add' })));

  const buttonAuto = document.getElementById('button-auto');
  const buttonAutoObs = Rx.Observable.fromEvent(buttonAuto, 'click');

  buttonAutoObs.subscribe(_ => send(JSON.stringify({ message: 'auto' })));
}
