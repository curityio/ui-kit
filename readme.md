# UI Kit

Customize the public facing styles and template to fit your needs.

🚩 Work In Progress

Monorepo using [**npm Workspaces**](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for Self Service Portal, Login Web App, Template System, and Styles

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

To start projects indivudually, run:

- `npm start:ussp` to start the Self Service Portal
- `npm start:login` to start the Login Web App,
- `npm start:templates` - to start the template-system",
- `npm start:styles` - to start the styles",

## Build

To build everything, run:

```shell
npm run build:all
```

To build projects indivudually, run:

- `npm run build:ussp` to build the Self Service Portal
- `npm run build:login` to build the Login Web App,
- `npm run build:templates` - to build the template-system",
- `npm run build:messages` - to build the messages",
- `npm run build:styles` - to build the styles",


## Deploy

This monorepo is a git submobule to the Identity Server. When built, the resulting build fold will end up in the right place, ready to be deployed.
