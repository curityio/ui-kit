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
const env = require('node-env-file');
const fs = require('fs');
const envFileName = "./environment";

const curityInstallationDir = undefined;
const additionalAssetsRoot = undefined;
const buildBase = "build";
const curityBuildBase = buildBase + "/curity";
const webRootBuildBase = curityBuildBase + "/webroot";
const templateBuildBase = curityBuildBase + "/templates";
const messagesBuildBase = curityBuildBase + "/messages";

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

      fonts: {
        src: './src/curity/fonts/*',
        dist: webRootBuildBase + '/assets/fonts/'
      },
      images: {
        src: './src/curity/images/**/*.{png,jpg,svg,gif,jpeg}',
        base: './src/curity/images/',
        dist: webRootBuildBase + '/assets/images/'
      },
      scripts: {
        base: './src/curity/js/',
        src: './src/curity/js/**/**/*.js',
        dist: webRootBuildBase + '/assets/js/'
      },
      libs: {
        dist : webRootBuildBase + "/assets/js/lib/"
      },
      scss: {
        src: './src/curity/scss/**/**/*.scss',
        files: ['./src/curity/scss/*.scss'],
        base: './src/curity/scss/',
        dist: webRootBuildBase + '/assets/css/'
      },
      templates: {
        base : './src/curity/templates',

        core : {
          src: './src/curity/templates/core/**/**.vm',
          base: './src/curity/templates/core'
        },
        overrides : {
          src: './src/curity/templates/overrides/**/**.vm',
          base: './src/curity/templates/overrides',
          dist: templateBuildBase + '/overrides'
        },
        template_areas: {
          src: './src/curity/templates/template-areas/**/**.vm',
          base: './src/curity/templates/template-areas',
          dist: templateBuildBase + '/template-areas'
        }
      },
      messages: {
        base : './src/curity/messages',
        overrides : {
          src: './src/curity/messages/overrides/**/**',
          base: './src/curity/messages/overrides',
          dist: messagesBuildBase + "/overrides",
        },
        template_areas : {
          src: './src/curity/messages/template-areas/**/**',
          base: './src/curity/messages/template-areas',
          dist: messagesBuildBase + "/template-areas",
        }
      }
    },
    idsvr: {
      installDir : curityInstallationDir
    },
  }
};
