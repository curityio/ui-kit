
# Curity UI Icons React

Library to use Curity UI icons in React based projects.

Reference site with all the icons [https://company.curityio.net/icons/](https://company.curityio.net/icons/)

## Run the example

```shell
cd example
npm i
npm start
```
## Add or update icons

Generate new icons

1. Use the [Curity SVG tooling repo](https://bitbucket.org/curity/svg-tooling/src/master/)
2. Export SVG files (from example Adobe Illustrator) to the `src` folder
3. Create React icon Components using these commands:

```shell
npm run react:library
```

4. Move everything inside `build/react/components`` to this repo, to the `src/components` folder

## Build the icon library

```shell
npm run build
```

## Build the icon library for Curity Self Service Portal

The Self Service Portal only uses a subset of icons inside the package. To build it, use:

```shell
npm run build:ssp
```

The `dist-ssp` contains the files that should be placed in the Self Service Portal `src/packages/icons`

> The generated src-ssp can be cleaned can be cleaned afterwards.

## Publish a new version to Nexus

This script will bump the npm version, do a git tag, commit and npm publish to Nexus in one command.

```shell
./release.sh <VERSION_NUMBER> <COMMIT_MESSAGE>
```

Example release 2.0.0

```shell
./release.sh 2.0.0 "Add language icons and SAML icons"
```
Use version and commit message as arguments

## Install in your project

Authenticate with our npm registry

```shell
curity-cli t
```

Install the package

```shell
npm install @curity-internal/ui-icons-react
```

## Use icons

Import icons like this

```js
import {IconVciCredentialCoupon} from "@curity-internal/ui-icons-react"
```

Use an icon like this

```js
<IconVciCredentialCoupon />
```

You can also pass props like this

```js
<IconVciCredentialCoupon color="white" width="48" height="48"/>
```

The `color` attribute in SVG will let the SVG children path, circle, polygon derive from this color, since they are set to use `currentColor`
