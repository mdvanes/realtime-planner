const WebSocket = require('ws');
const app = require('./http-server');
const server = require('http').createServer();
//const wss = new WebSocket.Server({ port: 9001, path: 'realtime', origin: 'http://localhost:9000' });
const wss = new WebSocket.Server({ server });
const appointments = require('./appointments');
const Appointment = require('./appointment');
const Rx = require('rxjs/Rx');
const TwitterStream = require('twitter-stream-api');
const fs = require('fs');
const keysString = fs.readFileSync('./keys.json');
const keys = JSON.parse(keysString);

let auto = false;
let autoTimeoutId = null;

// function stateToJsonString() {
//   return JSON.stringify({ auto, appointments });
// }

const state = { auto, appointments };
const stateSubject = new Rx.Subject();

// Ids for web socket clients. If non available, create UUID
const availableIds = [
  'Unidentified Ursula',
  'Random Robby',
  'Jane Doe',
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

const twitter$ = new Rx.Observable(function(observer) {
  const Twitter = new TwitterStream(keys, false);
  Twitter.stream('statuses/filter', {
    track: 'javascript, #ING' // Tracked tweet keywords
  });
  
  Twitter.on('data', function (obj) {
    const parsed = JSON.parse(obj.toString());
    const apt = new Appointment(
      '', 
      parsed.user.name, 
      parsed.id_str, 
      '@' + parsed.user.screen_name, 
      new Date(parsed.user.created_at));
    observer.next({
      apt
    })
  });  
})
.map(message => state => {
  //console.log('foo', message);
  stateSubject.next({
    type: 'add',
    appointment: message.apt
  });
  return Object.assign({}, state, {
    appointments: [message.apt, ...state.appointments]
  });
})
.share(); // only needed if demuxing with filters like below?

// Sequence called multiple times: https://github.com/Reactive-Extensions/RxJS/issues/294
const connectionMessage$ = new Rx.Observable(function(observer) {
  //console.log('New observable')

  wss.on('connection', function connection(client) {
    //console.log('New connection', Date.now())

    client.on('message', function(message) {
      observer.next({
        client,
        message
      });
    });

    client.on('error', err => {
      if (err.code === 'ECONNRESET') {
        // e.g. F5
        console.log('Warning: user disconnected forcibly'); // eslint-disable-line
      } else {
        throw err;
      }
    });

    client.on('close', () => restoreId(client.id));

    client.id = getId();
    observer.next({
      client,
      message: null
    });
    // Randomly send updated appointments
    //randomAdd(ws);
  });
}).map(container => {
  //console.log('c1', container);
  container.parsedMessage = container.message
    ? JSON.parse(container.message).message
    : { type: 'init' };
  return container;
})
.share();

const init$ = connectionMessage$
  .filter(({ parsedMessage }) => parsedMessage && parsedMessage.type === 'init')
  .map(({ client }) => state => {
    client.send(
      JSON.stringify({
        type: 'init',
        id: client.id,
        auto: state.isAuto,
        appointments: state.appointments
      })
    );
    return state;
  });

const add$ = connectionMessage$
  .filter(({ parsedMessage }) => parsedMessage && parsedMessage.type === 'add')
  .map(() => state => {
    const newAppointment = Appointment.createRandom();
    // TODO how to solve this side-effect? See also todo below
    stateSubject.next({
      type: 'add',
      appointment: newAppointment
    });
    return Object.assign({}, state, {
      //newAppointment,
      appointments: [newAppointment, ...state.appointments]
    });
  });
// .map(() => {
//   const newAppointment = appointment.createRandom();
//   appointments.push(newAppointment);
//   stateSubject.next({
//     type: 'add',
//     appointment: newAppointment
//   });
// });

const edit$ = connectionMessage$
  .filter(({ parsedMessage }) => parsedMessage.type === 'edit')
  .map(({ client, parsedMessage }) => state => {
    stateSubject.next({
      type: 'lock',
      forAptId: parsedMessage.forId,
      byClientId: client.id
    });
    return state;
  });

const auto$ = connectionMessage$
  .filter(({ parsedMessage }) => parsedMessage.type === 'auto')
  .map(() => state => {
    const isAuto = !state.isAuto;
    stateSubject.next({ type: 'auto', isAuto });
    // If auto=true, send random locks
    if (isAuto) {
      emulateBehavior(state.appointments);
    } else if (autoTimeoutId) {
      clearTimeout(autoTimeoutId);
      stateSubject.next({
        type: 'lock',
        forAptId: null,
        byClientId: 'AUTO'
      });
    }
    return Object.assign({}, state, {
      isAuto: !state.isAuto
    });
  });

const state$ = Rx.Observable.merge(init$, add$, edit$, auto$, twitter$).scan(
  (state, changeFn) => changeFn(state),
  {
    appointments: [],
    isAuto: false
  }
);

state$.subscribe(state => {
  console.log('New state', state.appointments.length, state.isAuto);
  //appointments = state.appointments;
  /* TODO remove the global "appointments" altogether */
});

/*
TODO on the client side all streams (e.g. add$, lock$) are merged and and scanned to update
the state and emit for each update on a state$ stream.
Then the subscription on state$ always handles the full UI with the complete new state.
However, that is not what would be efficient here, because on add only the new row should be send.
On lock only the ID, and only on init the full state. What would be a good solution?

If cm.client/cm.message is needed in the subscribe, they should be stored in the state when
mapping.

See also "stateSubject.next" side effect in add$.map
 */

// wss.on('connection', function connection(ws /*, req*/) {
//   // Error: message/onmessage is invalid event target
//   // TODO nodeCallback to do this
//   // Rx.Observable.fromEvent('onmessage').subscribe(x => {
//   //   appointments.push(appointment.createRandom());
//   //   console.log('observing on message', x);
//   // });
//
//   // TODO replace RxJS EventBus (Bjorn)
//   ws.on('message', function incoming(message) {
//     // console.log('received: %s', message);
//     const msg = JSON.parse(message);
//
//     // bus.next(add)
//     if (msg.message === 'add') {
//       // TODO The entire point is to discard global "appointments", but just to update previous state and pass it in
//       const newAppointment = appointment.createRandom();
//       appointments.push(newAppointment);
//       //stateSubject.next({ auto, appointments });
//       stateSubject.next({
//         type: 'add',
//         appointment: newAppointment
//       });
//     } else if (msg.type === 'edit') {
//       console.log('editing', msg.forId, 'by', ws.id);
//       stateSubject.next({
//         type: 'lock',
//         forAptId: msg.forId,
//         byClientId: ws.id
//       });
//     } else if (msg.message === 'auto') {
//       auto = !auto;
//       console.log('auto', auto);
//       stateSubject.next({ type: 'auto', auto });
//       // If auto=true, send random locks
//       if (auto) {
//         emulateBehavior();
//       } else if (autoTimeoutId) {
//         clearTimeout(autoTimeoutId);
//         stateSubject.next({
//           type: 'lock',
//           forAptId: null,
//           byClientId: 'AUTO'
//         });
//       }
//     }
//   });
//
//   ws.on('error', err => {
//     if (err.code === 'ECONNRESET') {
//       console.log('Warning: user disconnected forcibly'); // e.g. F5
//     } else {
//       throw err;
//     }
//   });
//
//   ws.on('close', () => restoreId(ws.id));
//
//   console.log('A web socket connection was made');
//   ws.id = getId();
//   // console.log(
//   //   'ws id =' +
//   //     req.headers['x-forwarded-for'] +
//   //     ' ' +
//   //     req.connection.remoteAddress
//   // );
//   ws.send(JSON.stringify({ type: 'init', id: ws.id, auto, appointments }));
//   // appointments.push(appointment.createRandom());
//   //stateSubject.next({ auto, appointments }); // TODO remove
//
//   // Randomly send updated appointments
//   //randomAdd(ws);
// });

// Now it will use the appointments that existed at the moment "auto" was toggled to "on", and ignore newly added appointments.
function emulateBehavior(stateAppointments) {
  const minMs = 1000;
  const maxMs = 30000;
  const delay = Math.floor(Math.random() * maxMs + minMs);
  let aptId = null;
  let readableId = null;
  if (stateAppointments.length > 0) {
    const apIndex = Math.floor(Math.random() * stateAppointments.length);
    aptId = stateAppointments[apIndex].aptId.toString();
    readableId = stateAppointments[apIndex].email;
  }
  console.log(`Will emulate lock in ${delay}ms on ${readableId}`); // eslint-disable-line
  autoTimeoutId = setTimeout(function() {
    stateSubject.next({
      type: 'lock',
      forAptId: aptId,
      byClientId: 'AUTO'
    });
    emulateBehavior(stateAppointments);
  }, delay);
}

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
//http.createServer(app).listen(9001, () => console.log('Listening at http://localhost:9001') );



// TODO: closure
// TODO: only on "auto"
// TODO: push "last tweet" to the front-end
// const Twitter = new TwitterStream(keys, false);
// Twitter.stream('statuses/filter', {
//   track: 'javascript, #ING' // TODO: We Are Here
// });

// const Writable = require('stream').Writable;
// const Output = Writable({objectMode: true});
// Output._write = function (obj, enc, next) {
//     const parsed = JSON.parse(obj.toString());
//     //console.log(parsed.id_str, parsed.text /*obj,*/ /*Object.getPrototypeOf(obj),*/ /*obj.toString()*/);
//     // console.log(new Date(parsed.user.created_at), 
//     // parsed.user.name, 
//     // '@', parsed.user.screen_name, 
//     // parsed.id_str)
//     const apt = new Appointment(
//       '', 
//       parsed.user.name, 
//       parsed.id_str, 
//       '@' + parsed.user.screen_name, 
//       new Date(parsed.user.created_at));
//     //console.log(apt);

//     // TODO: instead of this, it should throw an event to the server side state store
//     stateSubject.next({
//       type: 'add',
//       appointment: apt
//     });

//     next();
// };

// Twitter.pipe(Output);

// Twitter.on('data', function (obj) {
//   const parsed = JSON.parse(obj.toString());
//   console.log('twitter on data', parsed);
// });

module.exports = server;
