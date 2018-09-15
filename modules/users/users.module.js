const usersRoutes = require('./users.routes');

const UsersModule = {
    name: 'UserModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(usersRoutes(options.db));
    }
};

module.exports = UsersModule;