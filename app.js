const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
//const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const stat = require('./routes/stat');
const app = express();
const ws = require("nodejs-websocket");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/stat/', stat);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

/*******************/
/* WebSocket stuff */
/*******************/

const Microservice = require('./models/microservice');
type = 'normal'; // fast, normal, slow
const instanceAmount = 2;
const refreshInterval = 100; // in ms
var services = { green: [], red: [] };
requests = [];

for (let i = 1; i <= instanceAmount; i++) {
  services.green.push(new Microservice({ service: 'green', instance: i }));
  services.red.push(new Microservice({ service: 'red', instance: i }));
}

server = ws.createServer(conn => {
  console.log('New connection');
  conn.sendText("Welcome");
  conn.on('close', (code, reason) => {
    console.log('Connection closed');
  });
  conn.on('error', () => { });
}).listen(3001);

setInterval(() => {
  //if (requests.length > 0) console.log(requests.join(', '));
  requests = requests.filter(r => !r.isFinished);

  for (let i = 0; i < requests.length; i++) {
    let req = requests[i];
    if (req.inProcess) continue;
    switch (req.color) {
      case 'green':
        caseRun(req, 'green');
        break;
      case 'red':
        caseRun(req, 'red');
        break;
    }
  }
}, refreshInterval);

function caseRun(req, color) {
  for (let ii = 0; ii < services[color].length; ii++) {
    let s = services[color][ii];
    if (!s.isBusy()) {
      s.run(req, server, type);
      req.sendStatus(server, 'toService');
      req.inProcess = true;
      return;
    }
  }
  if (!req.inProcess) req.sendStatus(server, 'waiting');
}

module.exports = app;
