const emailsRoutes = require('./emails.routes');

const EmailsModule = {
    name: 'EmailsModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(emailsRoutes(options.db));
    }
};

module.exports = EmailsModule;