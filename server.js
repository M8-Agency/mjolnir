const express = require('express');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const mjolnir = require('./mjolnir');
app.use('/api', mjolnir());

app.get('/', function(req, res){
  res.send('hello world');
});

var port = process.env.PORT || 3001;
app.listen(port, function(){
    console.log('running server '+port)
});