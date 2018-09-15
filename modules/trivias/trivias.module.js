const triviasRoutes = require('./trivias.routes');

const TriviasModule = {
    name: 'TriviasModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(triviasRoutes(options.db));
    }
};

module.exports = TriviasModule;