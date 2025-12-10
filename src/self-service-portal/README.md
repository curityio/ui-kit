# Self-Service Portal

This project contains Self-Service Portal (SSP) component of Curity UI Kit.
The SSP is a customizable web application that allows end-users to manage their profiles, passwords, and other self-service functionalities.

## Usage

1. [Previewer](#self-service-portal-previewer)
2. [Customising Translations](#customising-translations)
3. [Customising Look&feel](#customising-look--feel)
4. [Extending SSP Application](#extending-ssp-application)

### Self-Service Portal Previewer

Previewer is a standalone application that allows developers to test and customize the SSP
without needing to deploy the Identity Server backed environment.
It provides a local development server with hot-reloading capabilities for rapid iteration.

To start the Self-Service Portal Preview, go to the `app` folder and run the following command:

```shell
cd app
npm start
```

This will launch a local development server where you can preview and test your customizations.

### Customising Translations

The Self-Service Portal supports internationalization (i18n) and allows you to customize translations
for different languages.

To customize translations, you can modify the translation files located in the
`messages/{language}/apps/self-service-portal` directory.

To add a new language, copy an existing language folder and name it with an appropriate language code (e.g., `fr` for French).
Then translate the content of the files within that folder.
To register a new language in the Identity Server, a folder with the desired language code must be created under the
`${IDSVR_HOME}/usr/share/messages/core` directory (e.g. `${IDSVR_HOME}/usr/share/messages/core/fr`).

The changes made to the translation files will be reflected on-the-fly in the SSP Previewer.

To deploy the custom translations to a production environment, copy the modified files to one
of the following directories on the Identity Server:
- `${IDSVR_HOME}/usr/share/messages/overrides/{language}/apps/self-service-portal` (for global overrides)
- `${IDSVR_HOME}/usr/share/messages/template-areas/{template-area}/{language}/apps/self-service-portal` (when using template areas)

directory on the Identity Server depending on usage or not of the template areas.

More on the localization in Identity Server can be found in the documentation:
[Identity Server - Localizing Resources](https://curity.io/docs/identity-server/developer-guide/front-end-development/localization.html).

### Customising Look & Feel

The easiest way how to customise the look and feel of the SSP is to use the Identity Server Admin UI Theme Builder
and the template areas.
For more information, see
[Identity Server Admin UI Theme Builder](https://curity.io/docs/identity-server/developer-guide/front-end-development/settings-and-theme.html).

For more advanced customisations, you can modify the styles and components by extending the SSP Application
and customizing the rendering template.

The Velocity template used to render the SSP Application on the Identity Server is located at:
`templates/apps/self-service-portal/index.vm`.

Edited versions of the template can be deployed to one of the following directories on the Identity Server:
- `${IDSVR_HOME}/usr/share/templates/overrides/apps/self-service-portal/index.vm` (for global overrides)
- `${IDSVR_HOME}/usr/share/templates/template-areas/{template-area}/apps/self-service-portal/index.vm` (when using template areas)

depending on usage or not of the template areas.

More on the template areas can be found in the documentation:
[Identity Server - Template Overrides](https://curity.io/docs/identity-server/developer-guide/front-end-development/overview.html)

### Extending SSP Application

The Self-Service Portal application is built using React and can be extended by modifying the source code located in the `app` directory.
