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
    console.log("java cmd: " + config.javaCmd);
    console.log("java args: " + config.javaArgs.join(' '));

    var javaPreviewer = spawn(config.javaCmd, config.javaArgs, {
            stdio: [
                0, // Use parent's stdin for child
                fs.openSync('java.out', 'w'),
                1 // Use parent's stdout for childs stderr
            ]
        }
    );

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
    console.log("  Static Root           : " + config.staticRoot);
    console.log("  Template Root         : " + config.templateRoot);
    console.log("  Message Root          : " + config.messageRoot);

    if ('additionalStaticRoot' in config) {
        console.log("  Additional static root: " + config.additionalStaticRoot);
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
    const programClass = "se.curity.templates.preview.App";

    var uiBuilderHome = __dirname + "/../../lib";

    var javaArgs = [];

    javaArgs.push("-classpath");
    javaArgs.push(getClasspath(uiBuilderHome));
    javaArgs.push(programClass);

    if (optionsOrArgv['idsvr-home'] !== undefined) {
        config['idsvrHome'] = optionsOrArgv['idsvr-home']
    }

    if (config.idsvrHome !== undefined) {
        javaArgs.push('-i');
        javaArgs.push(config['idsvrHome']);
        config['javaCmd'] = config.idsvrHome + '/lib/java/jre/bin/java';
    } else {
        config['javaCmd'] = 'java';
    }

    if (optionsOrArgv['additional-static-root'] !== undefined) {
        config['additionalStaticRoot'] = optionsOrArgv['additional-static-root'];
        javaArgs.push('-a');
        javaArgs.push(config['additionalStaticRoot'])
    }

    if (optionsOrArgv['template-root'] !== undefined) {
        config['templateRoot'] = optionsOrArgv['template-root']
    } else if (config.idsvrHome !== undefined) {
        config['templateRoot'] = config.idsvrHome + "/usr/share/templates";
    }
    if (config.templateRoot !== undefined) {
        javaArgs.push('-t');
        javaArgs.push(config['templateRoot']);
    }

    if (optionsOrArgv['message-root'] !== undefined) {
        config['messageRoot'] = optionsOrArgv['message-root']
    } else if (config.idsvrHome !== undefined) {
        config['messageRoot'] = config.idsvrHome + "/usr/share/messages";
    }
    if (config.messageRoot !== undefined) {
        javaArgs.push('-m');
        javaArgs.push(config['messageRoot']);
    }

    if (optionsOrArgv['static-root'] !== undefined) {
        config['staticRoot'] = optionsOrArgv['static-root']
    } else if (config.idsvrHome !== undefined) {
        config['staticRoot'] = config.idsvrHome + "/usr/share/webroot";
    }
    if (config.staticRoot !== undefined) {
        javaArgs.push('-s');
        javaArgs.push(config['staticRoot']);
    }

    config['javaArgs'] = javaArgs;
    return config;
}


/**
 * Init and start
 */
function init() {

    var settings = {
        'template-root' : paths.curity.templates.base,
        'message-root' : paths.curity.messages.base,
        'static-root' : paths.curity.webroot
    };

    if (paths.idsvr.installDir !== undefined) {
        settings['idsvr-home'] = paths.idsvr.installDir
    }
    if (paths.curity.additionalAssetsRoot !== undefined) {
        settings['additional-static-root'] = paths.curity.additionalAssetsRoot
    }

    start(settings);
  }

init()
