const WebSocket = require('ws');
const app = require('./http-server');
const server = require('http').createServer();
//const wss = new WebSocket.Server({ port: 9001, path: 'realtime', origin: 'http://localhost:9000' });
const wss = new WebSocket.Server({ server });
const appointments = require('./appointments');
const appointment = require('./appointment');

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    const msg = JSON.parse(message);
    if (msg.message === 'add') {
      appointments.push(appointment.createRandom());
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(appointments));
        }
      });
    }
  });

  ws.on('error', err => {
    if (err.code === 'ECONNRESET') {
      console.log('Warning: user disconnected forcibly'); // e.g. F5
    } else {
      throw err;
    }
  });

  ws.send(JSON.stringify(appointments));

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
//   // TODO observe changes to appointments and do send
//
//   appointments.push(appointment.createRandom());
//   ws.send(JSON.stringify(appointments));
//   appointments.push(appointment.createRandom());
//   ws.send(JSON.stringify(appointments));
// }

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
//http.createServer(app).listen(9001, () => console.log('Listening at http://localhost:9001') );

module.exports = server;
