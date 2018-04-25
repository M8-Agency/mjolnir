const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const brandsRouter = require('./api/brands');
app.use('/api/brands', brandsRouter.api());

app.get('/', function(req, res){
  res.send('hello world');
});

app.use((err, req, res, next) => {
    res.status(500).send({ 
      error : true,
      message : err.message,
      code : err.code
  })
})


app.listen(3000);