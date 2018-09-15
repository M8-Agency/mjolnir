require('dotenv').config();
const Mailgun = require('mailgun-js');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

//Email config
const mailgun = new Mailgun({
    apiKey: process.env.MAILER_KEY, 
    domain: process.env.MAILER_DOMAIN
});

/**
 * 
 * @param {string} html code of email
 * @param {*} data object with data to replace in html content
 */
function parseContent(html, data){
    for(index in data){
        html = html.replace(new RegExp(`%${index}%`, 'g'), data[index]);
    }
    return entities.decode(html)
}

/**
 * 
 * @param {*} to email to send
 * @param {*} subject of email
 * @param {*} htmlContent of email
 * @param {*} emailData optional object with data to replace in html template
 */
async function send(to, subject, htmlContent, emailData = {}){

    try{
        const emailConfig = {
            from: process.env.MAILER_FROM,
            to: to,
            subject: parseContent(subject, emailData),
            html: parseContent(htmlContent, emailData)
        };
        const sendData = await mailgun.messages().send(emailConfig)
        return true;

    }catch(error){
        return error.message;
    }
}

async function sendblock(subject, htmlContent, emailList){
    emailList.map((item, index)=>{
        send(item.email, subject, htmlContent, {
            name : item.name
        })
    })
}

module.exports = { 
    send, 
    sendblock 
}