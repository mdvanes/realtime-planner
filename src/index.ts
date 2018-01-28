import * as Rx from 'rxjs/Rx';

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
    console.log('message received: ' + msg, msg);
    const result: any = msg;
    console.log(result.foo);
    render(result);
  },
  err => console.log(err),
  () => console.log('complete')
);
subject.next(JSON.stringify({ message: 'Msg from browser' }));

// TODO add typing for "state", i.e. it should have an "appointments" property
function render(state) {
  const templ = `<dd>
            <dt>FOO</dt>
            <dl>${state.foo}</dl>
        </dd>`;
  // document.getElementById('main').innerHTML = templ;
  document.body.innerHTML = templ;
}
