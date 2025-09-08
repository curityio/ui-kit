# UI Kit

Customize the public facing styles and templates to fit your needs.

🚩 Work In Progress

Monorepo using [**npm Workspaces**](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for Self Service Portal, Login Web App, Template System, and Styles

## Node Version Management

This project uses a specific Node.js version as specified in the `.nvmrc` file. We recommend using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to ensure compatibility.

### Using nvm

If you have nvm installed, you can automatically use the correct Node.js version by running:

```shell
nvm use
```

This will read the version from `.nvmrc` and switch to it. If the specified version isn't installed, you'll be prompted to install it with:

```shell
nvm install
```

### Installing nvm

If you don't have nvm installed:

- **macOS/Linux**: Follow the [official installation guide](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Windows**: Use [nvm-windows](https://github.com/coreybutler/nvm-windows)

## Install

To install all dependencies across a monorepo using npm workspaces, you just run:

```shell
npm install
```

## Develop

To start preview servers concurrently for all projects, run:

```shell
npm start:all
```

To start projects individually, run:

- `npm start:ussp` to start the Self Service Portal
- `npm start:login` to start the Login Web App,
- `npm start:templates` - to start the Template System
- `npm start:styles` - to start the Styles

## Build

To build everything, run:

```shell
npm run build:all
```

To build projects individually, run:

- `npm run build:ussp` to build the Self Service Portal
- `npm run build:login` to build the Login Web App,
- `npm run build:templates` - to build the Template System
- `npm run build:messages` - to build Messages
- `npm run build:styles` - to build the Styles


## Deploy

This monorepo is a git submodule to the Identity Server. When built, the resulting build fold will end up in the right place, ready to be deployed.
