import * as Rx from 'rxjs/Rx';
import { notificationTitle } from './notification';
import * as partial from './partials';
import VTable from './vTable';

/*
TODO

1. on connect receive the full current state
2. on change, only send a delta

In either case, process first in vDom and then re-render vDom
 */

function unwrapButton(elem: any) {
  if (elem.tagName === 'BUTTON') {
    return elem;
  } else if (elem.tagName === 'I') {
    return elem.parentNode;
  }
}

export function doInitRender(vTable: VTable, send) {
  const output = partial.renderTable(vTable.getAppointments());
  const tableWrapperElem = document.getElementById('appointments-table');
  tableWrapperElem.innerHTML = output;

  addEditDialog();

  const dialog: any = document.querySelector('dialog');
  if (!dialog.showModal) {
    alert('Browser does not have native support for dialog element');
  }
  dialog.querySelector('.close').addEventListener('click', () => {
    send(JSON.stringify({ type: 'edit', forId: null }));
    dialog.close();
  });

  // Clicking an edit button on a row
  const tableWrapperObservable = Rx.Observable.fromEvent(
    tableWrapperElem,
    'click'
  )
    .filter(
      (ev: any) => ev.target.tagName === 'BUTTON' || ev.target.tagName === 'I'
    )
    .map((ev: any) => unwrapButton(ev.target).getAttribute('data-apt-id'));
  tableWrapperObservable.subscribe(aptId => {
    send(JSON.stringify({ type: 'edit', forId: aptId }));
    dialog.showModal();
  });
}

function addEditDialog() {
  const output = partial.renderEditDialog();
  document.getElementById('dialog-wrapper').innerHTML = output;
}

export function doNextRender(vTable: VTable) {
  const output = partial.renderTable(vTable.getAppointments());
  const tableWrapperElem = document.getElementById('appointments-table');
  tableWrapperElem.innerHTML = output;
}

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
  renderControls(state, send);
}

// TODO add typing for "state", i.e. it should have an "appointments" property
function renderControls(state, send) {
  const output = `${partial.renderButton()} ${partial.renderToggle(
    state.auto
  )} <div class="mdl-layout-spacer"></div><br/>`;
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
