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
var path = require('path');
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
        open: false,
        injectChanges: true,
        reloadDelay: 100,
        reloadDebounce: 200,
        ghostMode: false,
    });

    // Create .reload file if it doesn't exist
    if (!fs.existsSync(".reload")) {
        fs.writeFileSync(".reload", "");
    }

    function watchResource(path) {
        browsersync.watch(path, function (event, file) {
            const time = new Date();
            fs.utimesSync(".reload", time, time);
        });
    }

    function watchReload() {

        browsersync.watch(".reload", {
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 500,
                pollInterval: 100
            }
        }).on("change", function (file) {
            browsersync.reload();
        });
    }

    function watchInjectableResource(path) {
        console.log("Watching: " + path);
        const watcher = browsersync.watch(path, {
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 300,
                pollInterval: 100
            }
        });

        watcher.on("change", function(file) {
            browsersync.reload(file);
        });

    }

    if ('messageRoot' in config || 'message-root' in config) {
        watchReload();
    }
    if ('templateRoot' in config || 'template-root' in config) {
        const templateRoot = config.templateRoot || config['template-root'];
        watchResource(templateRoot + "/**/**.vm");
    }
    if ('staticRoot' in config || 'static-root' in config) {
        const staticRoot = config.staticRoot || config['static-root'];
        const cssPath = staticRoot + "/**/**.css";
        console.log("Static root CSS watch path: " + cssPath);
        watchInjectableResource(cssPath);
        watchInjectableResource(staticRoot + "/**/**.js");
        watchInjectableResource(staticRoot + "/**/**.{gif,jpeg,jpg,png,svg,webp}");
    }
    if ('additionalStaticRoot' in config || 'additional-static-root' in config) {
        const additionalStaticRoot = config.additionalStaticRoot || config['additional-static-root'];
        watchInjectableResource(additionalStaticRoot + "/**/**.css");
        watchInjectableResource(additionalStaticRoot + "/**/**.js");
        watchInjectableResource(additionalStaticRoot + "/**/**.{gif,jpeg,jpg,png,svg,webp}");
    }
}

/**
 *
 * Start java
 */
function startJava(config) {
    console.log("proc cmd: " + config.procCmd);
    console.log("proc args: " + config.procArgs.join(' '));

    var javaPreviewer;
    if (os.platform() === "win32" && config.procCmd.toLowerCase().endsWith('.cmd')) {
        var cmdArgs = ['/c', config.procCmd].concat(config.procArgs);
        javaPreviewer = spawn('cmd.exe', cmdArgs, { windowsHide: true });
    } else {
        var spawnOptions = os.platform() === "win32" ? { shell: true } : undefined;
        javaPreviewer = spawn(config.procCmd, config.procArgs, spawnOptions);
    }

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
        var execPath = optionsOrArgv['exec-path'];
        if (os.platform() === "win32" && execPath.endsWith('.sh')) {
            var windowsExecPath = execPath.replace(/\.sh$/, '.cmd');
            if (fs.existsSync(windowsExecPath)) {
                execPath = windowsExecPath;
            }
        }
        config['procCmd'] = path.resolve(__dirname, execPath);
    } else {
        throw "Exec path must be specified";
    }
    config['procArgs'] = procArgs;
    config['static-root'] = optionsOrArgv['static-root'];
    config['template-root'] = optionsOrArgv['template-root'];
    config['message-root'] = optionsOrArgv['message-root'];
    config['additional-static-root'] = optionsOrArgv['additional-static-root'];
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
        'exec-path': os.platform() === "win32" ? '../../lib/run-ui-kit-server.cmd' : '../../lib/run-ui-kit-server.sh',
        'port': 8080,
    };

    if (paths.curity.additionalAssetsRoot !== undefined) {
        settings['additional-static-root'] = paths.curity.additionalAssetsRoot
    }

    start(settings);
  }

init()
