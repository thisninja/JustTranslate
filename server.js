var Hapi = require('hapi');
var request = require('request-promise');
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
        test: {a: 1, b: 2},
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
            request('https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20150120T002528Z.2126c945e0033cc4.29d883edef031620bee00dd72e3d1419a6ee274b&ui=en').then(function(data) {
                routeOptions.data = data.toString();
                var newData = JSON.parse(data);
                console.log(newData.langs);
                routeOptions.langs = newData.langs;
                console.log(typeof routeOptions.langs);
                    reply.view('index', routeOptions);
            });

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
