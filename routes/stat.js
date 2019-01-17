const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
  let data = fs.readFileSync('views/stat.html');
  res.type('text/html');
  res.send(data);
});

module.exports = router;
