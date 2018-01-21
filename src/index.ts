import * as Rx from 'rxjs/Rx';

console.log('ts hi');

Rx.Observable
    .of(1,2,3)
    .map(x => x + '!!!')
    .subscribe(x => console.log(x));