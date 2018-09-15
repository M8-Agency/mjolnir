const applicationsRoutes = require('./applications.routes');

const ApplicationsModule = {
    name: 'ApplicationsModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(applicationsRoutes(options.db));
    }
};

module.exports = ApplicationsModule;