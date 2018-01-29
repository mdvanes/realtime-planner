const server = require('./ws-server');
// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port

process.env.PORT = 9001; // TODO
server.listen(process.env.PORT, function() {
  console.log(`http/ws server listening on ${process.env.PORT}`);
});
