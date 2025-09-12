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

/*-------------------------------------------------------------------
Paths
-------------------------------------------------------------------*/
var env = require('node-env-file');
var fs = require('fs');
var envFileName = "./environment";

var curityInstallationDir = undefined;
var additionalAssetsRoot = undefined;
var buildBase = "build";
var curityBuildBase = buildBase + "/curity";
var webRootBuildBase = curityBuildBase + "/webroot";
var templateBuildBase = curityBuildBase + "/templates";
var messagesBuildBase = curityBuildBase + "/messages";

// Check if an environment file is present.
if (fs.existsSync(envFileName)) {
    env(envFileName);
    if (process.env.INSTALLATION_DIR !== undefined) {
        curityInstallationDir = process.env.INSTALLATION_DIR + "/idsvr";
    }
    if (process.env.ADDITIONAL_ASSETS_ROOT !== undefined) {
        additionalAssetsRoot = process.env.ADDITIONAL_ASSETS_ROOT;
    }
}

if (curityInstallationDir !== undefined) {
    console.log("Using Idsvr Installation from " + curityInstallationDir);
}

module.exports = {
  basePaths : {
    build: {
      base: buildBase
    },
    npm: {
      base: './node_modules/'
    },

    //Curity
    curity : {
      dist : curityBuildBase,
      webroot : webRootBuildBase,
      additionalAssetsRoot: additionalAssetsRoot,

      templates: {
        base : 'templates',

        core : {
          src: 'templates/core/**/**.vm',
          base: 'templates/core'
        },
        overrides : {
          src: 'templates/overrides/**/**.vm',
          base: 'templates/overrides',
          dist: templateBuildBase + '/overrides'
        },
        template_areas: {
          src: 'templates/template-areas/**/**.vm',
          base: 'templates/template-areas',
          dist: templateBuildBase + '/template-areas'
        }
      },
      messages: {
        base : 'messages',
        overrides : {
          src: 'messages/overrides/**/**',
          base: 'messages/overrides',
          dist: messagesBuildBase + "/overrides",
        },
        template_areas : {
          src: 'messages/template-areas/**/**',
          base: 'messages/template-areas',
          dist: messagesBuildBase + "/template-areas",
        }
      }
    },
    idsvr: {
      installDir : curityInstallationDir
    },
  }
};
