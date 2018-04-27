const express = require('express');
const app = express();
const mjolnir = require('./mjolnir');


app.use('/api', mjolnir());

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);