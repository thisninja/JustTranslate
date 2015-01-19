var Hapi = require('hapi');
exports.startServer = function(config, callback) {
    var port = process.env.PORT || config.server.port;
    var serverOptions = {
        views: {
            path: config.server.views.path,
            engines: {
                jade: require('jade')

            }
        }
    };

    var server = new Hapi.Server('localhost', port, serverOptions);

    var routeOptions = {
        reload: config.liveReload.enabled,
        LangObj1: {
            title: 'English'
        },
        LangObj2: {
            title: 'Ukrainian'
        },
        optimize: ((config.isOptimize && config.isOptimize) ? true : false),
        cachebust: ((process.env.NODE_ENV !== "production") ? "?b=#{(new Date()).getTime()}" : '')
    };

    // Default Route
    server.route({
        method: 'GET',
        path: '/',
        handler: function(req, reply) {
            reply.view('index', routeOptions);

        }
    });

    // Statically load public assets
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });

    server.start(function() {
        console.log('Server running at:', server.info.uri);
    });

    callback(server.listener);
};
