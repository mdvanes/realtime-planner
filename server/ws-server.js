const WebSocket = require('ws');
const app = require('./http-server');
const server = require('http').createServer();
//const wss = new WebSocket.Server({ port: 9001, path: 'realtime', origin: 'http://localhost:9000' });
const wss = new WebSocket.Server({ server });
const appointments = require('./appointments');

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
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
  randomAdd(ws);
});

function randomizeFirstName() {
  const names = [
    'Peter',
    'Carol',
    'Bruce',
    'Donald',
    'Tony',
    'Luke',
    'Natasha',
    'Matt',
    'Steve',
    'James',
    'Warren',
    'Steven',
    'Hank',
    'Bobby',
    'Clint',
    'Jennifer',
    'Jessica'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function randomizeLastName() {
  const names = [
    'Parker',
    'Danvers',
    'Banner',
    'Blake',
    'Stark',
    'Cage',
    'Romanova',
    'Murdock',
    'Rogers',
    'Howlett',
    'Worthington',
    'Strange',
    'Pym',
    'Drake',
    'Barton',
    'Walters',
    'Jones'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function maybeGetPhonenumber() {
  if (Math.random() > 0.5) {
    return `06${Math.random()
      .toString()
      .slice(2, 10)}`;
  }
  return null;
}

function guessEmail(firstName, lastName) {
  return (
    firstName.slice(0, 1) +
    '.' +
    lastName +
    '@example.com'
  ).toLowerCase();
}

function randomAppointment() {
  const firstName = randomizeFirstName();
  const lastName = randomizeLastName();
  return {
    firstName,
    lastName,
    date: new Date(),
    phone: maybeGetPhonenumber(),
    email: guessEmail(firstName, lastName)
  };
}

function randomAdd(ws) {
  const minMs = 1000;
  const maxMs = 30000;
  const timeout = Math.random() * maxMs + minMs;
  setTimeout(function() {
    appointments.push(randomAppointment());
    ws.send(JSON.stringify(appointments));
    randomAdd(ws);
  }, timeout);
}

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
//http.createServer(app).listen(9001, () => console.log('Listening at http://localhost:9001') );

module.exports = server;
