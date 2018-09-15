const eventsRoutes = require('./events.routes');

const EventsModule = {
    name: 'EventsModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(eventsRoutes(options.db));
    }
};

module.exports = EventsModule;