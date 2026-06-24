# HAAPI React App

## Project & tools

Install all workspaces from the repo root:

```shell
curity-cli t && npm i --prefix "$(git rev-parse --show-toplevel)"
```

- React
- Built with Vite
- ESLint with React-specific plugins - `npm run lint`
  - IDEs usually provide inline feedback.
  - IntelliJ settings in `Languages & Frameworks | JavaScript | Code Quality Tools | ESLint`.
- Prettier - `npm run prettier-check` (check only)
  - IDEs usually have Prettier integrated with the "format code" commands.
  - IntelliJ has a [plugin](https://plugins.jetbrains.com/plugin/10456-prettier). Additional settings in `Languages & Frameworks | JavaScript | Prettier`.

## SDK documentation

This app is built on the [HAAPI React SDK](../haapi-react-sdk/haapi-stepper/README.md). Browse its
interactive documentation — run it locally from the repo root:

```shell
cd src/haapi-react-sdk/docs && npm run docs
```

or open it in the browser with no setup, and the code editor hidden, on
[StackBlitz](https://stackblitz.com/~/github.com/curityio/ui-kit/tree/feature/IS-11008/haapi-react-sdk-docs?view=preview).

## Development setup

The Vite development server is used both to serve the application and as a proxy for specific Identity Server endpoints.
This allows running the application as a type-0 client (which is the realistic scenario) and still get all the Vite/React development facilities.

Follow these steps to get started:

1. Start Identity Server locally.
   - The server should have a minimum setup to allow running OAuth authorization flows with user interaction.
2. In this directory, run `IDSVR_HOME=<idsvr_home> ./configure-idsvr-dev.sh`.
   - `IDSVR_HOME` should contain the path to the home directory of the running Identity Server instance.
3. Run `npm run dev`.

## Deploying to Identity Server

Identity Server includes a Velocity template to serve the application (`views/api-driven-ui/index.vm`), as well as the corresponding assets (`usr/share/webroot/assets/css/api-driven-ui.css` and `usr/share/webroot/assets/js/api-driven-ui.js`).

Customizations to the application can be deployed to the Identity Server by building the current project (`npm run build`) and copying/replacing the mentioned assets and/or overriding the loader template.
As with other templates, the loader template can also be overridden in specific template areas.

To test the updates, enable the API-driven UI in the Identity Server instance and run an OAuth flow for any OAuth client that is available in the system and capable of user-interactive flows.

## Error Handling

### ErrorBoundary

**Purpose**: Global error boundary that catches unhandled React errors and displays fallback UI.

**Example Usage**:

```tsx
<ErrorBoundary>
  <HaapiStepper>
    <Application />
  </HaapiStepper>
</ErrorBoundary>
```

**Features:**

- Catches JavaScript errors anywhere in the component tree
- Displays user-friendly error messages with retry functionality
- Prevents entire application crashes
- Includes error reporting for debugging

## Folder Structure

Inspired by the Domain-Driven Design approach, this project's folder structure is organized by 2 dimensions/levels:

### **Dimension 1: Subdomain/Feature**

- **First level folders** represent different **subdomains or features** the app implements
- Each subdomain encapsulates related functionality

#### **Shared Code Organization**

- **`shared/` folder**: Contains libraries used by multiple subdomains/features

### **Dimension 2: Technical Layer Types**

Within each subdomain, code is organized by these technical layer types:

#### **`feature/`**

- **Purpose**: Smart UI components with data access
- **Contains**: Business logic components that connect to data sources. "Smart" components that manage state and side effects
- **Examples**: Components that handle authentication flows, form submissions, API calls

#### **`ui/`**

- **Purpose**: Presentational components only
- **Contains**: "Dumb" components focused on rendering. No business logic, just UI rendering based on props
- **Examples**: Buttons, input fields, layout components, styled elements

#### **`data-access/`**

- **Purpose**: Backend interaction and state management
- **Contains**: API clients, state management code, data transformation. Handles all external data operations
- **Examples**: HTTP service functions, Redux stores

#### **`util/`**

- **Purpose**: Low-level shared utilities
- **Contains**: Helper functions, constants, type definitions. Reusable across multiple components/features
- **Examples**: Date formatters, validation functions, common types

### **Example Schema**

```
src/
├── haapi-react-sdk/        # SDK consumed by the app (alias @curity/haapi-react-sdk)
│   └── haapi-stepper/      # Subdomain: HAAPI authentication flows
│       ├── feature/        # Smart components (HaapiStepper)
│       ├── ui/             # Presentational components
│       └── util/           # Helper functions (browser-apis)
├── shared/                 # Cross-cutting concerns
│   ├── feature/            # Shared smart components (Form)
│   ├── ui/                 # Shared presentational components (Spinner, Layout)
│   └── util/               # Shared utilities (api-responses, type-utils)
```

This structure promotes:

- **Discoverability**: Clear separation makes code easy to find
- **Maintainability**: Similar responsibilities are grouped together
- **Reusability**: Shared components can be easily identified and reused
- **Scalability**: New features can follow the same pattern
- **Domain Focus**: Business logic is organized by feature/subdomain rather than technical concerns
