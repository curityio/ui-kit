/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const glob = require('glob');
const paths = require("./config").basePaths;

const ROOT = path.resolve(__dirname, "./");
const TEMP_DIR = path.resolve(ROOT, "./build/curity/temp");

const IMAGES_SRC_DIR = path.resolve(ROOT, "src/curity/images/*.{jpg,webp,png,svg,gif}");
const IMAGES_BUILD_DIR = path.resolve(
  ROOT,
  "build/curity/webroot/assets/images"
);

const CSS_SOURCE_DIR = path.resolve(ROOT, paths.curity.scss.base);
const CSS_BUILD_DIR = path.resolve(ROOT, paths.curity.scss.dist);

const FONTS_SOURCE_DIR = path.resolve(ROOT, paths.curity.fonts.src);
const FONTS_BUILD_DIR = path.resolve(ROOT, paths.curity.fonts.dist);

const MESSAGES_SOURCE_DIR = path.resolve(ROOT, paths.curity.messages.overrides.src);
const MESSAGES_BUILD_DIR = path.resolve(ROOT, paths.curity.messages.overrides.dist);

const MESSAGES_TEMPLATE_AREAS_SOURCE_DIR = path.resolve(ROOT, paths.curity.messages.template_areas.src);
const MESSAGES_TEMPLATE_AREAS_BUILD_DIR = path.resolve(ROOT, paths.curity.messages.template_areas.dist);

const TEMPLATE_AREAS_SOURCE_DIR = path.resolve(ROOT, paths.curity.templates.template_areas.src);
const TEMPLATE_AREAS_BUILD_DIR = path.resolve(ROOT, paths.curity.templates.template_areas.dist);

const TEMPLATE_OVERRIDES_SOURCE_DIR = path.resolve(ROOT, paths.curity.templates.overrides.src);
const TEMPLATE_OVERRIDES_BUILD_DIR = path.resolve(ROOT, paths.curity.templates.overrides.dist);

const JS_SOURCE_DIR = path.resolve(ROOT, paths.curity.scripts.base);
const JS_BUILD_DIR = path.resolve(ROOT, paths.curity.scripts.dist);

const JQUERY_LIB_SOURCE_DIR = path.resolve(ROOT, "node_modules/jquery/dist/");
const JQUERY_LIB_BUILD_DIR = path.resolve(
  ROOT,
  "build/curity/webroot/assets/js/lib"
);

const jqueryPackageInfo = require(path.resolve(
  ROOT,
  "node_modules/jquery/package.json"
));

const prodOptimization = {
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: false,
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          "default",
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
  ],
};

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const config = {
    context: ROOT,
    target: "web",
    mode: isDevelopment ? "development" : "production",
    devtool: false,
    watch: isDevelopment ? true : false,
    stats: { warnings: false },
    entry: {
        ...glob.sync(`${CSS_SOURCE_DIR}/*.scss`).reduce(function(obj, el) {
            if (!path.basename(el).startsWith('_')) {
              obj[path.parse(el).name] = el;
            }
            return obj;
          }, {}),
       "curity-ui": {
        "import": `${JS_SOURCE_DIR}/curity-ui.js`,
        "library": {
          "name": "curityui",
          "type": "var"
        }
      },
      "reload": "./.reload",
    },
    output: {
      path: TEMP_DIR,
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader" },
            { loader: "sass-loader" },
          ],
        },
        {
          test: /\.(jpg|png|svg)$/,
          type: "asset/resource",
        },
        {
          test: /\.(jpg|png|svg|webp)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name][ext][query]",
          },
        },
        {
          test: /\.(woff?|woff2)(\?v=\w+)?$/,
          generator: {
            filename: "assets/fonts/[name][ext][query]",
          },
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].css`,
      }),
      new FileManagerPlugin({
        events: {
          onEnd: [
            {
              copy: [
                {
                  source: `${JQUERY_LIB_SOURCE_DIR}/jquery.min.js`,
                  destination: `${JQUERY_LIB_BUILD_DIR}/${`jquery-${jqueryPackageInfo.version}.min.js`}`,
                },
                {
                    source: `${TEMP_DIR}/curity-ui.js`,
                    destination: `${JS_BUILD_DIR}/curity-ui.js`,
                },
                {
                    source: `${TEMP_DIR}/*.css`,
                    destination: CSS_BUILD_DIR
                },
                {
                  source: `${IMAGES_SRC_DIR}`,
                  destination: IMAGES_BUILD_DIR,
                },
                {
                  source: `${FONTS_SOURCE_DIR}`,
                  destination: FONTS_BUILD_DIR,
                },
                {
                  source: `${MESSAGES_SOURCE_DIR}`,
                  destination: MESSAGES_BUILD_DIR,
                },
                {
                  source: `${MESSAGES_TEMPLATE_AREAS_SOURCE_DIR}`,
                  destination: MESSAGES_TEMPLATE_AREAS_BUILD_DIR,
                },
                {
                  source: `${TEMPLATE_AREAS_SOURCE_DIR}`,
                  destination: TEMPLATE_AREAS_BUILD_DIR,
                },
                {
                  source: `${TEMPLATE_OVERRIDES_SOURCE_DIR}`,
                  destination: TEMPLATE_OVERRIDES_BUILD_DIR,
                },
              ],
            },
            {
              delete: [`${TEMP_DIR}`],
            },
          ],
        },
      }),
    ],

    optimization: isDevelopment
      ? {
        minimizer: [new TerserPlugin()],
      }
      : prodOptimization
  };

  return config;
};
