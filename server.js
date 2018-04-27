const express = require('express');
const app = express();
const mjolnir = require('./mjolnir');


app.use('/api', mjolnir());

app.get('/', function(req, res){
  res.send('hello world');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('running server '+port)
});