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
const availableIds = ['Random Robby', 'Anonymous Albert'];
function getId() {
  const id = availableIds.pop();
  if (!id) {
    return new Date().getTime().toString();
  }
  return id;
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

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // console.log('received: %s', message);
    const msg = JSON.parse(message);

    if (msg.message === 'add') {
      // TODO The entire point is to discard global "appointments", but just to update previous state and pass it in
      appointments.push(appointment.createRandom());
      stateSubject.next({ auto, appointments });
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

  console.log('A ws connection was made', ws.id);
  ws.id = getId();
  console.log('ws id =', ws.id);
  ws.send(JSON.stringify({ id: ws.id }));
  appointments.push(appointment.createRandom());
  stateSubject.next({ auto, appointments });

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
