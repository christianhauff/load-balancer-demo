const express = require('express');
const router = express.Router();
const validButtons = ['green', 'red'];
const Request = require('../models/request');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Cloud Computing - Userinterface', id: getRandomId(), time: 0 });
});

router.get('/test/', (req, res, next) => {
  res.render('test', { title: 'Cloud Computing - Testinginterface ', id: getRandomId(), time: 0 });
});

router.post('/', (req, res, next) => {
  //let id = req.body.id;
  let button = req.body.button;
  if (!button) return res.status(400).send('Sent id is empty');
  if (!validButtons.includes(button)) return res.status(400).send('Sent button not valid');

  let rndId = getRandomId();
  requests.push(new Request({ color: button, id: rndId }));

  res.send(JSON.stringify(`Request successful for ${button} with id ${rndId}`));
});

router.post('/type', (req, res, next) => {
  let t = req.body.type;
  if (!type) return res.status(400).send('Sent id or button is empty');
  type = t;
  res.send(JSON.stringify(`Type successfully set to ${t}`));
});


function getRandomId() {
  return Math.random().toString(36).substring(2, 15);
}

module.exports = router;
