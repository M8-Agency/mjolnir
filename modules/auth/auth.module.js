const authRoutes = require('./auth.routes');

const AuthModule = {
    name: 'AuthModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(authRoutes(options.db));
    }
};

module.exports = AuthModule;