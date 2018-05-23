require('dotenv').config();
const Mailgun = require('mailgun-js');
const emailModel = require('../models/email')
//DB
const config = require('../lib/config')
const db = require('../lib/db');
const Email = emailModel(config)
const tools = require('../rest/tools')

//Email config
const mailgun = new Mailgun({
    apiKey: process.env.MAILER_KEY, 
    domain: process.env.MAILER_DOMAIN
});

const send = function(res, next, emailId, emailData, actionResponse){
    
    Email.findById(emailId).then((response)=>{
        const emailConfig = {
            from: process.env.MAILER_FROM,
            to: emailData.to,
            subject: tools.parseContent(response.subject, emailData),
            html: tools.parseContent(response.htmlBody, emailData)
        }

        mailgun.messages().send(emailConfig, (error, body) => {
            if (error) {
                next(error)
            }else {
                res.status(200).json(actionResponse);
            }
        });

    }).catch((error)=>{
        next(error)
    })    
}

module.exports = {send}