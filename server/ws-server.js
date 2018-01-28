const WebSocket = require('ws');
const app = require('./http-server');
const server = require('http').createServer();
//const wss = new WebSocket.Server({ port: 9001, path: 'realtime', origin: 'http://localhost:9000' });
const wss = new WebSocket.Server({ server });

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('error', (err) => {
        if(err.code === 'ECONNRESET') {
            console.log('Warning: user disconnected forcibly'); // e.g. F5
        } else {
            throw err;
        }
    });

    ws.send(JSON.stringify({foo: 'something'}));
});

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port
//http.createServer(app).listen(9001, () => console.log('Listening at http://localhost:9001') );

module.exports = server;