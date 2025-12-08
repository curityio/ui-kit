# Curity Self Service Portal

The Curity Self-Service Portal (SSP) is a customizable web application that allows end-users to manage their profiles, passwords, and other self-service functionalities.

Further instructions requires to install the npm project:

```shell
npm install
```

## Usage
1. [Previewer](#previewer)
2. [Development](#development)
3. [Build](#build)
4. [Deployment](#deployment)

## Previewer

The Previewer is a standalone application that allows developers to test and customize the SSP without needing to deploy the Identity Server backed environment. 
It provides a local development server with hot-reloading capabilities for rapid iteration.
It's backend part is mocked to simulate interactions with the Identity Server.

To start the Preview run the following command:

```shell
npm start
```

## Development
To develop and test the application against a real Identity Server instance, you need to set up a development environment:
1. Configure an Identity Server instance with the Self-Service Portal enabled. 
   Follow the instructions in the [Identity Server documentation](https://curity.io/docs/idsvr/latest/application-service-admin-guide/applications/self-service-portal.html) to set up the SSP.
2. Copy the `.env-example` to e.g. `.env.local` and update the environment variables to point to your Identity Server instance and configure other settings as needed.
3. Start the development server with the following command:

```shell
npm run dev
```

### Environment file
```env
VITE_APP_APP_BASE_PATH= //SPA base path, e.g.: /
VITE_APP_BFF_BASE_URL= // IDSVR base path, e.g.: https://localhost:8443
VITE_APP_METADATA_PATH= //IDSVR ssp api path, e.g.: /apps/self-service-portal/api/.well-known
VITE_THEME_LOGO= // base64 encoded logo image
VITE_THEME_INTRO_IMG= // base64 encoded intro image
```

## Build

To build the Self-Service Portal application for production, run the following command:

```shell
npm run build
```

This will create an optimized production build in the `dist` directory.

## Deployment

There are two options how to take the SSP application into use:

### SSP served under the Identity Server

1. Copy the contents of the `dist/assets` directory to the Identity Server under the following path:
   `${IDSVR_HOME}/usr/share/webroot/assets/apps/self-service-portal/`
2. In case the html template needs to be customized, check the parent README.md for instructions.
3. Create a Self-Service Portal Application in the Identity Server. 
   Follow the instructions in the [Identity Server documentation](https://curity.io/docs/idsvr/latest/application-service-admin-guide/applications/self-service-portal.html) to set up the SSP.
4. Copy the `.env-example` to e.g. `.env` and update the [environment variables](#environment-file) to point to your Identity Server instance and configure other settings as needed.
5. The Identity Server will serve the SSP application under the path which can be found from the Admin UI.

### SSP served as a standalone application

In the standalone deployment scenario, the SSP application is hosted separately from the Identity Server.

It's important to ensure that the Self-Service Portal and the Identity Server are configured to be under the same site domain
to allow proper cookie sharing for authentication and session management.  
[Definition of same site](https://developer.mozilla.org/en-US/docs/Glossary/Site)

1. Deploy the contents of the `dist` directory to your web server or hosting environment.
2. Create a Self-Service Portal Application in the Identity Server.
3. Set the web server URL to the Self-Service Portal Application.
4. Copy the `.env-example` to e.g. `.env` and update the [environment variables](#environment-file) to point to your Identity Server instance and configure other settings as needed.
5. Ensure that the Self-Service Portal and the Identity Server are configured to be under the same site domain to allow proper cookie sharing for authentication and session management. 
   It's convenient to use a reverse proxy in front of both applications to achieve this.