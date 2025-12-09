# UI Kit

Customize the look and feel of your applications.

Monorepo using [**npm Workspaces**](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for Curity Identity Server Templates, Self Service Portal, Login Web App,  Curity CSS, and Curity UI Icons React.

## Prerequisites
- Java v21 or later
- Node.js (version as specified in the `.nvmrc` file)

## Setup

This project uses a specific Node.js version as specified in the `.nvmrc` file. We recommend using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to ensure compatibility.

#### Using nvm

If you have nvm installed, you can automatically use the correct Node.js version by running:

```shell
nvm use
```

This will read the version from `.nvmrc` and switch to it. If the specified version isn't installed, you'll be prompted to install it with:

```shell
nvm install
```

#### Installing nvm

If you don't have nvm installed:

- **macOS/Linux**: Follow the [official installation guide](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Windows**: Use [nvm-windows](https://github.com/coreybutler/nvm-windows)

## Install

To install all dependencies across a monorepo using npm workspaces, you just run:

```shell
npm install
```

## Start Preview Servers

To start preview servers concurrently for all projects, run:

```shell
npm start
```

Then you can access the projects at:

- Curity Identity Server Templates: [http://localhost:3002](http://localhost:3000)
- Self Service Portal: [http://localhost:3000](http://localhost:5173/previewer)

To start projects individually, run:

- `npm start:identity-server` - to start the Curity Identity Server Templates
- `npm start:ussp` to start the Self Service Portal
- `npm start:lwa` to start the Login Web App

## Build

To build everything, run:

```shell
npm run build
```

To build projects individually, run:

- `npm run build:identity-server` to build the Identity Server Templates
- `npm run build:ussp` to build the Self Service Portal
- `npm run build:lwa` to build the Login Web App
- `npm run build:css` to build Curity CSS library
- `npm run build:icons` to build Curity UI Icons React library


## Deploy

Once built, the build artifacts can be moved to the Curity Identity Server.
