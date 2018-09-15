const Mailer = require('../mailer')
const Confirm = require('prompt-confirm');
const reminderAR = require('./data/htmls/reminder.ar')
const reminderBR = require('./data/htmls/reminder.br')
const reminderCO = require('./data/htmls/reminder.co')
const reminderPA = require('./data/htmls/reminder.pa')
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
//const userList = require('./data/list/inactivos')

subject = {
    "AR": " ¡%recipient_name% aún tienes fotos por subir! ¡Apresúrate!",
    "BR": " %recipient_name% você ainda tem fotos para subir! Apresse-se!",
    "PA": " ¡%recipient_name% aún tienes fotos por subir! ¡Apresúrate!",
    "CO": " ¡%recipient_name% aún tienes fotos por subir! ¡Apresúrate!",
}

html = {
    "AR": reminderAR,
    "BR": reminderBR,
    "PA": reminderPA,
    "CO": reminderCO
}

sender = async () => {
    //userList.map(async (user, index) => {
        
        const sending = await Mailer.send('test-reminder@copaairlines.m8agency.com', subject['AR'], entities.decode(html['AR']), {})
        
        console.log('sending', sending)
        
    //})
}

const confirm = new Confirm(`Do you send email to list test-reminder@copaairlines.m8agency.com`).ask( (answer) => {
    if(answer){
        console.log('sending');
        sender();
    }else{
        console.log('error');        
    }
    
});


