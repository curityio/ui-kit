# Identity Server Templates

UI Kit package for the Curity Identity Server, providing customizable templates, styles, scripts, and localization for authentication flows and user interfaces.

## Overview

This package contains all frontend resources for the Curity Identity Server login and authentication experiences. It includes Apache Velocity templates, CSS styling, JavaScript functionality, localization files, and image assets.

📚 **Documentation**: For front-end development guidance, see the [Curity Identity Server Front-End Development Guide](https://curity.io/docs/identity-server/developer-guide/front-end-development/).

## Structure

### `messages/`
Contains localization files for different languages organized by area:
- `core/` - Core system messages (en, pt, pt-pt, sv)
- `overrides/` - Custom message overrides
- `template-areas/` - Template area-specific messages

Supported languages: English (en), Portuguese (pt, pt-pt), Swedish (sv)

### `templates/`
Apache Velocity (`.vm`) templates for authentication flows:
- `site.vm` - Main site template wrapper
- `core/` - Core templates
- `overrides/` - Custom template overrides
- `template-areas/` - Modular template components

Common templates include:
- Authentication & login flows
- Multi-factor authentication
- Consent screens
- Device authorization
- Account linking
- Error pages

### `styles/`
Curity CSS is used as the base styling framework. On top of that, some custom styles are applied for Identity Server-specific UI elements.
- Curity CSS: [src/common/css/lib/readme.md](../common/css/lib/readme.md)
- `css/` - Individual CSS modules for different authentication flows
  - `authenticator-icons.css` - Authenticator branding
  - `consent.css` - Consent screen styles
  - `deviceflow.css` - Device flow styles
  - `dialog.css` - Modal dialogs
  - And more...
- `index.js` - Main style entry point


### `scripts/`
JavaScript utilities and client-side functionality:
- `curity-ui.js` - Core UI interactions and behaviors
- Form validation
- Dynamic UI updates
- Client-side utilities

### `images/`
Image assets:
- Brand logos
- Icons
- Background images
- Illustrative graphics

### `build/`
Build output directory containing compiled assets:
- `webroot/assets/` - Static assets for deployment
- `messages/` - Compiled message bundles
- `templates/` - Processed templates

## Development

### Prerequisites

- Node.js >= 20.16.0
- npm >= 10.8.1

### Installation

```bash
npm install
```

### Development Workflow

1. **Start the development server:**
   ```bash
   npm start
   ```
   This runs both the Java server and watches templates and assets for changes

3. **Make changes:**
   - Edit templates in `templates/`
   - Modify styles in `styles/`
   - Update messages in `messages/`
   - Add scripts in `scripts/`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Customization

### Overriding Templates

Place custom templates in `templates/overrides/` to override core templates:

```
templates/
  overrides/
    authenticate/
      login.vm
```

### Customizing Messages

Add language-specific overrides in `messages/overrides/`:

```
messages/
  overrides/
    en/
      messages.properties
```

### Styling

1. Modify existing CSS files in `styles/css/`
2. Import custom styles in `styles/index.js`
3. Build to compile changes

### Template Areas

Use template areas for modular components that can be injected into core templates:

```
templates/
  template-areas/
    header.vm
    footer.vm
```

## Build Output

The build process generates:

```shell
build
├── messages
│   ├── overrides
│   └── template-areas
├── templates
│   ├── overrides
│   └── template-areas
└── webroot
    └── assets
```

To deploy build artifacts (assets, templates, and messages) to a production environment, use the `deploy.sh` script. See the main README for more instructions.

## License

Apache-2.0 - Copyright (C) 2025 Curity AB. All rights reserved.
