import * as Rx from 'rxjs/Rx';
// import {connectableObservableDescriptor} from "rxjs/observable/ConnectableObservable";

// console.log('ts hi');
//
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
  // const templ = `<dd>
  //           <dt>FOO</dt>
  //           <dl>${state[0].name}</dl>
  //       </dd>`;
  const output = renderButton() + '<br/>' + renderTable(state);
  // document.getElementById('main').innerHTML = templ;
  //console.log(output);
  document.body.innerHTML = output;
  document.querySelector('button').addEventListener('click', add);
}

function add() {
  //alert('hoi2');
  subject.next(JSON.stringify({ message: 'add' }));
}

function renderButton() {
  return '<button>Add</button>';
}

function renderTable(apts) {
  return '<table>' + apts.map(renderRow).join('') + '</table>';
}

function renderRow(apt) {
  return `<tr>
    <td>${apt.date}</td>
    <td>${apt.firstName} ${apt.lastName}</td>
    <td>${apt.phone || ''}</td>
    <td>${apt.email}</td>
  </tr>`;
}
