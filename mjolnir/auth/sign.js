require('dotenv').config();
var auth = require('./')

auth.sign({username : 'test'}, process.env.SECRET, console.log)