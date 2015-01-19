exports.config = {
    "modules": [
        "copy",
        "server",
        "jshint",
        "csslint",
        "require",
        "minify-js",
        "minify-css",
        "live-reload",
        "bower",
        "sass",
        "jade",
        "live-reload"
    ],
    liveReload: {
        enabled: true,
        additionalDirs: ["views"]
    }
}
