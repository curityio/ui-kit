/*
 * Copyright (C) 2016 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

var fs = require('fs');
var browsersync = require("browser-sync").create('local');
var spawn = require('child_process').spawn;
var os = require('os');
var classpathSeparator = os.platform() === "win32" ? ';' : ':';
const paths = require('./config').basePaths


/**
 * Prepare settings and start java
 */
start = function (options) {
    var config = prepareSettings(options);
    startJava(config);

    // Wait a few seconds for the Java previewer to start
    setTimeout(function () {
        watch(config);
    }, 2500);
};

/**
 * Sets up Browser Sync watchers
 */
function watch(config) {

    browsersync.init({
        proxy: "127.0.0.1:8080/listing",
        open: false
    });

    function watchResource(path) {
        console.log("Watching: " + path);
        browsersync.watch(path, function (event, file) {
            const time = new Date();
            fs.utimesSync(".reload", time, time);
            browsersync.reload(path);
        });
    }

    function watchReload() {
        console.log("Watching: .reload");
        browsersync.watch(".reload", function (event, file) {
            browsersync.reload(".reload");
        });
    }

    function watchInjectableResource(path) {
        console.log("Watching: " + path);
        browsersync.watch(path).on("change", browsersync.reload);
    }

    if ('messageRoot' in config) {
        watchReload();
    }
    if ('templateRoot' in config) {
        watchResource(config.templateRoot + "/**/**.vm");
    }
    if ('staticRoot' in config) {
        watchInjectableResource(config.staticRoot + "/**/**.css");
        watchInjectableResource(config.staticRoot + "/**/**.js");
        watchInjectableResource(config.staticRoot + "/**/**.{gif,jpeg,jpg,png,svg,webp}");
    }
    if ('additionalStaticRoot' in config) {
        watchInjectableResource(config.additionalStaticRoot + "/**/**.css");
        watchInjectableResource(config.additionalStaticRoot + "/**/**.js");
        watchInjectableResource(config.additionalStaticRoot + "/**/**.{gif,jpeg,jpg,png,svg,webp}");
    }
}

/**
 *
 * Start java
 */
function startJava(config) {
    console.log("proc cmd: " + config.procCmd);
    console.log("proc args: " + config.procArgs.join(' '));

    var javaPreviewer = spawn(config.procCmd, config.procArgs);

    process.on('exit', function () {
        console.log('Killing java process');
        javaPreviewer.kill();
    });

    javaPreviewer.on('exit', function (code, signal) {
        console.log("Java process terminated with code %s, exiting.", code);
        process.exit(1);
    });

    console.log("Spawned Java server: " + javaPreviewer.pid);

    console.log("Preview server acting on:");
    console.log("  Static Root           : " + config['static-root']);
    console.log("  Template Root         : " + config['template-root']);
    console.log("  Message Root          : " + config['message-root']);

    if ('additionalStaticRoot' in config) {
        console.log("  Additional static root: " + config['additional-static-root']);
    }
}

/**
 * Finds the jars and prepares the classpath for the java runnable
 */
function getClasspath(uiBuilderLibs) {
    var files = fs.readdirSync(uiBuilderLibs);
    var jars = [];
    for (var i = 0; i < files.length; i++) {
        if (files[i].endsWith(".jar")) {
            jars.push(uiBuilderLibs + "/" + files[i]);
        }
    }

    return jars.join(classpathSeparator);
}

/**
 * Parse and prepare settings
 */
function prepareSettings(optionsOrArgv) {
    var config = {};

    var uiBuilderHome = __dirname + "/../../lib";

    var procArgs = [];

    if (optionsOrArgv['idsvr-home'] !== undefined) {
        procArgs.push('-i');
        procArgs.push(optionsOrArgv['idsvr-home']);
    }

    if (optionsOrArgv['port'] !== undefined) {
        procArgs.push("-p");
        procArgs.push(optionsOrArgv['port']);
    } else {
        throw "Port must be specified";
    }

    if (optionsOrArgv['template-root'] !== undefined) {
        procArgs.push('-t');
        procArgs.push(optionsOrArgv['template-root']);
    } else {
        throw "Template root must be specified";
    }

    if (optionsOrArgv['message-root'] !== undefined) {
        procArgs.push('-m');
        procArgs.push(optionsOrArgv['message-root']);
    } else {
        throw "Message root must be specified";
    }

    if (optionsOrArgv['static-root'] !== undefined) {
        procArgs.push('-s');
        procArgs.push(optionsOrArgv['static-root']);
    } else {
        throw "Static root must be specified";
    }

    if (optionsOrArgv['additional-static-root'] !== undefined) {
        procArgs.push('-a');
        procArgs.push(optionsOrArgv['additional-static-root'])
    }

    if (optionsOrArgv['exec-path'] !== undefined) {
        config['procCmd'] = optionsOrArgv['exec-path'];
    } else {
        throw "Exec path must be specified";
    }
    config['procArgs'] = procArgs;
    return config;
}

/**
 * Init and start
 */
function init() {

    var settings = {
        'template-root' : paths.curity.templates.base,
        'message-root' : paths.curity.messages.base,
        'static-root' : paths.curity.webroot,
        'exec-path': '../../lib/run-ui-kit-server.sh',
        'port': 8080,
    };

    if (paths.curity.additionalAssetsRoot !== undefined) {
        settings['additional-static-root'] = paths.curity.additionalAssetsRoot
    }

    start(settings);
  }

init()
