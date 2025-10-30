# Curity Self Service Portal

## Tools in use

- React
- Typescript
- Vite
- Vitest
- GraphQL and Apollo
- ESlint
- Prettier
- Curity CSS
- Curity UI Icons React

## APIs

- User Management GraphQL API
- Granted Authorizations GraphQL API
- Account Management GraphQL API
- Sessions API (TBD)

## JIRA Ticket

- [IS-7086](https://curity.atlassian.net/browse/IS-7086)

## Read

- [Token Management GraphQL API - Google Slide by Pedro Felix](https://docs.google.com/presentation/d/15KWIDJEFqcdnqeL4Q9Ggk8Bl8EyxayCFnbBY0yzzy7U/edit#slide=id.g300fdf765e1_0_75)
- [User Self Service Portal- Google Slide by Urban Sanden](https://docs.google.com/presentation/d/1n7fgDThz3wDfoqk7K5BsIKOUZ7GwphJlD3moKAzgQM0/edit#slide=id.p)

### Identity Server Setup

- Start the server with default debug configuration.
- Upload the following configuration files, found in the server repository:

  - `test/integration-tests/src/test/resources/test-config/apps/self-service-portal-app-standalone.xml`
  - `test/integration-tests/src/test/resources/test-config/apps/self-service-portal-features.xml`

  This can be done in two ways:

  1. NPM script: `npm run setup-idsvr`
  2. Using the Admin UI, via the Changes / Upload menu item.

This will add a Token Handler Application and a corresponding OAuth client configured for the Self Service Portal running in the Vite dev server.
It will also configure authenticators, the Opt-in MFA action and the User Management profile to support the portal features.

### Install

Get an auth token with Curity CLI

```shell
curity-cli t
```

```shell
npm install
```

## Run

```shell
npm start
```

## Build

```shell
npm run build
```

## Development

### i18n translations

This app uses [react-i18next](https://react.i18next.com/) for translations.

This app is supported in 'en', 'sv', 'pt' and, 'pt-PT' languages but is the backend that detects the user's language (based in the Accept Language header) and sends the correct translations. In the fronted we use `useTranslation` to display those values.

```tsx
const { t } = useTranslation();

return <span>{t('sign-in')}</span>;
```

### GraphQL

This project uses [Apollo Client](https://www.apollographql.com/docs/react/data/queries) to perform GraphQL queries and mutations.

This project uses [GraphQL Codegen](https://the-guild.dev/graphql/codegen/docs/guides/react-vue) to generate typings and typed query and mutation documents.

Steps:

0. If the GraphQL schemas have changed in the `identity-server`:
   0.1. In the `admin-ui` run `npm run download-graphql-api-schemas` to download the current `identity-server`'s graphql schemas to `curity-web-ui/graphql-apis`.
   0.2. Copy them and replace the existing ones in this project (e.g. `shared/data-access/API/user-management/schemas/user_management_api.graphqls`).
1. Write the queries in `src/shared/data-access/API/[API_NAME]/[API_NAME]-queries.graphql` (e.g. [User Management Queries](src/shared/data-access/API/user-management/user-management-queries.graphqls)).
2. Write the mutations in `src/shared/data-access/API/[API_NAME]/[API_NAME]-mutations.graphql` (e.g. [User Management Mutations](src/shared/data-access/API/user-management/user-management-mutations.graphqls)).
3. In case you write fragments, place them in `src/shared/data-access/API/[API_NAME]/[API_NAME]-fragments.graphql` (e.g. [User Management Fragments](src/shared/data-access/API/user-management/user-management-fragments.graphqls)).
4. Run the command `npm run generate-graphql-typings-queries-and-mutations`.
5. Add the generated query and mutation documents to the API map in `src/shared/data-access/API/[API_NAME]/api.ts` (e.g. [User Management API Map](src/shared/data-access/API/user-management/api.ts))
6. Add generic error messages for the new operations if the BE errors for them are not meaningful (e.g. [User Management Error Messages](src/shared/data-access/API/user-management/USER_MANAGEMENT_ERROR_MESSAGES.ts))
7. Use the generated typings, queries and mutations:

```typescript
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';

export const Account = () => {
  // Query variables and data results are typed when using query from '@/shared/data-access/API/GRAPHQL_API'
  const { data: accountResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: 'test' },
  });

  ...
};
```

### UI Configuration

The User Self-Service Portal UI is configurable by the customer through a JSON configuration object. This object defines the available resources and the operations permitted on them. The `UI Configuration` feature manages access to pages and the visibility of certain elements within the application based on this configuration.

#### Example Configuration

```typescript
export const UI_CONFIG: UiConfig = {
  resourceGroups: {
    userManagement: {
      resources: {
        name: {
          operations: [UI_CONFIG_OPERATIONS.READ],
        },
        address: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
        },
      },
    },
  },
};
```

#### Key Concepts

##### Resource

- A `resource` represents a backend (BE) entity the UI interacts with (CRUD operations).

##### Operation

- An `operation` refers to an action performed on a `resource`, mapped to a backend GraphQL operation and payload.
- The `read` operation (`UI_CONFIG_OPERATIONS.READ`) is implicitly included when any other operation is granted (e.g., `UI_CONFIG_OPERATIONS.UPDATE`) .

For example, in the `UiConfig` above:

- The `name` resource is read-only.
- The `address` resource is readable and editable.

#### Conditional UI Elements

##### UiConfigIfRoute

The [UiConfigIfRoute](/src/ui-config/feature/UiConfigIfRoute.tsx) component allows accessing a route only if the `UiConfig` allows the `read` operation (`UI_CONFIG_OPERATIONS.READ`) for some (`allowAccessWithPartialResourcePermissions:true` (default)) or all (`allowAccessWithPartialResourcePermissions: false`) the resources associated to that route.

```tsx
{
    path: USSP_ROUTE_PATHS.ACCOUNT,
    title: 'Account',
    element: (
      <UiConfigIfRoute>
        <Account />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS],
  },
```

Explanation:

- The `USSP_ROUTE_PATHS.ACCOUNT` route is linked to the `name` and `address` resources (`UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME`, `UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS`).
- Since the `UiConfig` allows the `read` operation for both resources, users can access this route.

When a required operation is not permitted for some/all of the specified resources, `UiConfigIfRoute` redirects users to the [FeatureNotAvailable](/src/shared/ui/FeatureNotAvailable.tsx) component.

##### UiConfigIf

The [UiConfigIf](/src/ui-config/feature/UiConfigIf.tsx) component conditionally renders elements based on the `UiConfig`:

```tsx
<UiConfigIf
  resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
  allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
>
  <Input
    label="First Name"
    value={firstName}
    onChange={handleGivenNameChange}
  />
</UiConfigIf>

<UiConfigIf
  resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
  allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
>
  <Input
    label="Street"
    value={street}
    onChange={handleStreetChange}
  />
</UiConfigIf>
```

Explanation:

- The `UiConfigIf` component ensures that elements are only rendered if some (`displayWithPartialResourcePermissions:true` (default)) or all (`displayWithPartialResourcePermissions: false`) specified resources permit some or all specified operations.
- Given the previous `Example Configuration`:
  - The First Name input would be hidden (since `UI_CONFIG_OPERATIONS.UPDATE` is not granted for `name`).
  - The Street input would be visible (since `UI_CONFIG_OPERATIONS.UPDATE` is granted for `address`).

##### EditableContent

The [EditableContent](/src/shared/ui/EditableContent/EditableContent.tsx) displays an edit button besides the value that allows editing it when clicked. It accepts the `uiConfigResources` and the `uiConfigAllowedOperations` props that are passed down to the internal `UiConfigIf` component to manage wether the value can be read and edited.

```tsx
<EditableContent
  uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
  uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
>
  <Input
    label="Last Name"
    id="familyName"
    value={familyName}
    onChange={handleFamilyName}
    className="flex flex-gap-1"
    labelClassName="flex-30"
    inputClassName="flex-auto"
  />
</EditableContent>
```

Explanation:

- This `EditableContent` will display the `familyName` value only when the `UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME` resource has `UI_CONFIG_OPERATIONS.READ` permissions in the `UiConfig`.
- This `EditableContent` will display the edit button only when the `UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME` resource has `UI_CONFIG_OPERATIONS.UPDATE` permissions in the `UiConfig`.

### Error Handling

The Curity Self Service Portal employs a robust error-handling mechanism to ensure a seamless user experience. Below are the key components and strategies used for error handling:

#### Error Boundaries

- **RouteErrorBoundary**: A React Error Boundary is used to catch JavaScript errors in the component tree. It prevents the entire application from crashing and displays a user-friendly fallback UI.

#### GraphQL Error Handling

- **Error Link**: The Apollo Client's `onError` link is configured to handle GraphQL errors. It retries unauthorized requests once and displays user-friendly error messages for other errors.
- **Error Messages**: Predefined error messages are mapped to GraphQL operations in `GRAPHQL_API_ERROR_MESSAGES` for consistent error reporting. Some GraphQL operations do return meaningful errors. To get them displayed to the user instead, remove the corresponding `operationName` key from `GRAPHQL_API_ERROR_MESSAGES`.

### UI Icons

We use a subset of our internal package `@curity-internal/ui-icons-react`. Since Self Service Portal will be a product we ship we can't use the internal package, hosted on Nexus and only available for Curity Developers to install. Instead local icon components are used, located in `src/packages`.

Import icons like this:

```jsx
import { IconToken } from '@curity-ui-kit/icons';
```

If there are any icons missing we will update them accordingly.
