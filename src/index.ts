import * as Rx from 'rxjs/Rx';
// import {connectableObservableDescriptor} from "rxjs/observable/ConnectableObservable";

// Rx.Observable
//     .of(1,2,3)
//     .map(x => x + '!!!')
//     .subscribe(x => console.log('Observable of array', x));

const subject = Rx.Observable.webSocket('ws://localhost:9001');
subject.retry().subscribe(
  msg => {
    // const x = JSON.stringify(JSON.parse(msg));
    // console.log('message received: ' + msg, msg);
    const result: any = msg;
    // console.log(result.foo);
    render(result);
  },
  err => console.log(err),
  () => console.log('complete')
);
subject.next(JSON.stringify({ message: 'Msg from browser' }));

// TODO add typing for "state", i.e. it should have an "appointments" property
function render(state) {
  const output = renderButton() + '<br/>' + renderTable(state);
  document.getElementById('target').innerHTML = output;
  document.getElementById('button-add').addEventListener('click', add);
}

function add() {
  subject.next(JSON.stringify({ message: 'add' }));
}

function renderButton() {
  return (
    `<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="button-add">
    <i class="material-icons">add</i>
    </button><div class="mdl-layout-spacer"></div>`
  );
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
