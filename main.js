import Test from './test.js';
//import Rx from './node_modules/rxjs/bundles/Rx.js';
import * as Rx from './node_modules/rxjs/Rx.js';

console.log('hoi1', new Test());

Rx.Observable
    .of(1,2,3)
    .map(x => x + '!!!')
    .subscribe(x => console.log(x));