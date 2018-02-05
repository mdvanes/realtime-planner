const WebSocket = require('ws');
const app = require('./http-server');
const server = require('http').createServer();
//const wss = new WebSocket.Server({ port: 9001, path: 'realtime', origin: 'http://localhost:9000' });
const wss = new WebSocket.Server({ server });
const appointments = require('./appointments');
const appointment = require('./appointment');
const Rx = require('rxjs/Rx');

let auto = false;

// function stateToJsonString() {
//   return JSON.stringify({ auto, appointments });
// }

const state = { auto, appointments };
const stateSubject = new Rx.Subject();

// Ids for web socket clients. If non available, create UUID
const availableIds = [
  'Unidentified Ursula',
  'Jane Doe',
  'Random Robby',
  'Anonymous Albert'
];
function getId() {
  const id = availableIds.pop();
  if (!id) {
    return new Date().getTime().toString();
  }
  return id;
}

function restoreId(id) {
  availableIds.push(id);
}

stateSubject.subscribe({
  next: v => {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(v));
      }
    });
  }
});

stateSubject.next(state);

/* TODO because it is a subject, this is also possible
var obs = Rx.Observable.from([the on message event]);
obs.subscribe(stateSubject);
Which will also call stateSubject.next when the onMessage event is fired.
See: websocket.addEventListener(type, listener) on https://github.com/websockets/ws/blob/master/doc/ws.md
type {String} A string representing the event type to listen for.
listener {Function} The listener to add.
 */

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws /*, req*/) {
  // Error: message/onmessage is invalid event target
  // Rx.Observable.fromEvent('onmessage').subscribe(x => {
  //   appointments.push(appointment.createRandom());
  //   console.log('observing on message', x);
  // });

  ws.on('message', function incoming(message) {
    // console.log('received: %s', message);
    const msg = JSON.parse(message);

    if (msg.message === 'add') {
      // TODO The entire point is to discard global "appointments", but just to update previous state and pass it in
      const newAppointment = appointment.createRandom();
      appointments.push(newAppointment);
      //stateSubject.next({ auto, appointments });
      stateSubject.next({
        type: 'add',
        appointment: newAppointment
      });
    } else if (msg.type === 'edit') {
      console.log('editing', msg.forId, 'by', ws.id);
      stateSubject.next({
        type: 'lock',
        forAptId: msg.forId,
        byClientId: ws.id
      });
    } else if (msg.message === 'auto') {
      auto = !auto;
      console.log('auto', auto);
      stateSubject.next({ auto, appointments });
    }
  });

  ws.on('error', err => {
    if (err.code === 'ECONNRESET') {
      console.log('Warning: user disconnected forcibly'); // e.g. F5
    } else {
      throw err;
    }
  });

  ws.on('close', () => restoreId(ws.id));

  console.log('A web socket connection was made');
  ws.id = getId();
  // console.log(
  //   'ws id =' +
  //     req.headers['x-forwarded-for'] +
  //     ' ' +
  //     req.connection.remoteAddress
  // );
  ws.send(JSON.stringify({ type: 'init', id: ws.id, auto, appointments }));
  // appointments.push(appointment.createRandom());
  stateSubject.next({ auto, appointments }); // TODO remove

  // Randomly send updated appointments
  //randomAdd(ws);
});

// function randomAdd(ws) {
//   // const minMs = 1000;
//   // const maxMs = 30000;
//   // const timeout = Math.random() * maxMs + minMs;
//   // setTimeout(function() {
//   //   appointments.push(randomAppointment());
//   //   ws.send(JSON.stringify(appointments));
//   //   randomAdd(ws);
//   // }, timeout);
//
//
//   appointments.push(appointment.createRandom());
//   ws.send(JSON.stringify(appointments));
//   appointments.push(appointment.createRandom());
//   ws.send(JSON.stringify(appointments));
// }

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
//http.createServer(app).listen(9001, () => console.log('Listening at http://localhost:9001') );

module.exports = server;
