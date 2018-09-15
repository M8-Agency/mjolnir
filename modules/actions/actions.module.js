const actionsRoutes = require('./actions.routes');

const ActionsModule = {
    name: 'ActionsModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(actionsRoutes(options.db));
    }
};

module.exports = ActionsModule;