require('dotenv').config();

const env = process.env.NODE_ENV || 'development'
var express = require('express');
var path = require('path');
var app = express();

var pTimeout = env === 'production' ? 60000 : 10000
var pInterval = env === 'production' ? 25000 : 10000
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  'pingTimeout': pTimeout,
  'pingInterval': pInterval
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

// Serve os arquivos estáticos da pasta 'dist' ANTES das rotas
app.use(express.static(path.join(__dirname, 'dist')));

// logging
app.use(function(req, res, next) {
  console.log('path: ' + req.path)
  console.log('query:')
  console.log(req.query)
  console.log('body:')
  console.log(req.body)
  console.log('----------------------------')
  next()
});

var port = process.env.PORT || 3000;

var routes = require('./routes');
routes(app, io);

// Rota catch-all para a Single Page Application.
// DEVE ser registrada DEPOIS das rotas da API.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var socketHandler = require('./socket/handler');

io.on('connect', function(socket) {
  socketHandler(io, socket);
});

server.listen(port, function() {
  console.log('App listening on port ' + port + '!');
});
