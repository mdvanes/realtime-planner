import * as Rx from 'rxjs/Rx';

console.log('ts hi');

Rx.Observable
    .of(1,2,3)
    .map(x => x + '!!!')
    .subscribe(x => console.log(x));



// import WebSocket from 'ws';
//
// const ws = new WebSocket('ws://localhost:9001');
//
// ws.on('open', function open() {
//     ws.send('something');
// });
//
// ws.on('message', function incoming(data) {
//     console.log(data);
// });

const socket = new WebSocket('ws://localhost:9001');
socket.onopen = function() {

    console.log('Socket open.');
    socket.send(JSON.stringify({message: 'Msg from browser'}));
    console.log('Message sent.')
};
socket.onmessage = function(message) {

    console.log('Socket server message', message);
    //const data = JSON.parse(message.data);
    //document.getElementById('response').innerHTML = JSON.stringify(data, null, 2);
};

// TODO
// Rx.Observable.webSocket()
// let subject = Observable.webSocket('ws://localhost:8081');
// subject
//     .retry()
//     .subscribe(
//         (msg) => console.log('message received: ' + msg),
//         (err) => console.log(err),
//         () => console.log('complete')
//     );
// subject.next(JSON.stringify({ op: 'hello' }));