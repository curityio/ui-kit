# Curity CSS library

The baseline CSS toolkit for that Curity look and feel.

## What?

Curity CSS s our CSS base and utility classes to style everything that lives inside a browser, a Curity web project, demo app, SPA, Docs or anything.

## Usage

Authenticate with our npm registry

```shell
curity-cli t
```

or

Install package

```shell
npm install @curity-internal/css
```

Import

```js
import '@curity-internal/css/dist/index.css'
```

## Development

Setup

```shell
nvm use
```

```shell
npm install
```

### Run

```shell
npm start
```

### Build

```shell
npm run build
```

### Publish

```shell
curity-cli t
```

Bump version

```shell
npm version X.X.X
```

You can alaso increment a minor for example using this:

```shell
npm version minor
```

Publish to Nexus

```shell
npm publish
```

## Publish - Do it all!

- curity-cli t
- update_npmrc_token
- npm version
- git tag
- commit
- publish

```jsx
npm run build \
&& curity-cli t \
&& update_npmrc_token \
&& npm version 0.6.6 \
&& git tag 0.6.6 \
&& git add . \
&& git commit -m "Normalized transparent button, add docs" \
&& git push origin master --tags \
&& npm pack \
&& npm publish
```
