# HAAPI React SDK

## Conceptual Glossary

- **Flow**: sequence of steps that results in either a successful authentication (`HAAPI_STEPS.COMPLETED_WITH_SUCCESS`) or an error/failure (`HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR`).
- **Step**: A single stage in the authentication flow, often represented as a screen (e.g., a login page). A step can be composed of actions, links, and messages.
  - [Step types](./util/types/haapi-step.types.ts)
- **Action**: instructions about how to progress to the next step in the authentication flow. Actions often require specific user input and change the state of the authentication (e.g., submitting a form). There are three kinds of action: **form** (e.g. a username/password login form), **client operation** (e.g. a BankID or WebAuthn operation) and **selector** (e.g. choosing an authenticator).
  - [Action types](./util/types/haapi-action.types.ts)
- **Link**:  instructions about how to navigate to an alternative but related path (e.g. starting a password reset flow from the main authentication step)
  - [Link](./util/types/haapi-step.types.ts#L300)
- **Message**: Text that provides context to the user about the state of the authentication flow and possible interaction options (e.g., validation errors, warnings, or instructions).
  - [Message](./util/types/haapi-step.types.ts#L290)

Check out the following HAAPI documentation for in-depth technical details:

* [Browserless Login Solution](https://curity.io/product/user-journey-orchestration/browserless-login/)
* [What is Hypermedia Authentication API](https://curity.io/resources/learn/what-is-hypermedia-authentication-api/)
* [HAAPI Data Model](https://curity.io/docs/haapi-data-model/latest/).


## Purpose

The HAAPI React SDK is a set of React components that fully manages HAAPI authentication
flows in the frontend. It works out of the box with minimal setup and lets you customize the UI
only as far as you need.

## Main Actors Overview

`HaapiStepper` **runs the flow**; everything else is about **how you render it**.

### `HaapiStepper` — runs the flow

A headless provider that manages multi-step HAAPI authentication workflows. Wrap your app in it.

```tsx
<HaapiStepper>
  {/* your UI goes here */}
</HaapiStepper>
```

### `useHaapiStepper()` — read & advance the flow

A hook that exposes the ongoing `HaapiStepper` authentication flow: its current step and state
(`currentStep`, `loading`, `error`), the `history` of steps taken so far, and a `nextStep`
function to advance it.

```tsx
const { currentStep, loading, error, history, nextStep } = useHaapiStepper();
```

### `HaapiStepperStepUI` — the default UI

Renders any HAAPI flow step out of the box, providing a complete default **opinionated** login UI. It is the fastest way to get HAAPI flows running, and the starting point you customize from.

```tsx
<HaapiStepper>
  <HaapiStepperStepUI />
</HaapiStepper>
```

### HAAPI Stepper UI Components — the building blocks

The UI representation of the HAAPI entities (`HaapiStep` → `HaapiStepperStepUI`, `HaapiUserMessage` → `HaapiStepperMessageUI`…). These are the building blocks `HaapiStepperStepUI` is made of, and what you compose your own UI from.

```tsx
function Step() {
  const { currentStep, nextStep } = useHaapiStepper();
  if (!currentStep) return null;

  const { actions, messages, links } = currentStep.dataHelpers;

  return (
    <>
      <HaapiStepperMessagesUI messages={messages} />
      <HaapiStepperActionsUI actions={actions.all} onAction={nextStep} />
      <HaapiStepperLinksUI links={links} onClick={nextStep} />
    </>
  );
}

<HaapiStepper>
  <Step />
</HaapiStepper>
```

## Optional Customization Overview

Start with the zero-effort default and adopt customization **only as far as you need**.

| | Effort | Control | What you use |
|---|--------|---------|--------------|
| Default | None | Low | `HaapiStepper` + `HaapiStepperStepUI` |
| Styles customization | Very low | Look only | CSS classes (`.haapi-stepper-*`) |
| Render interceptors | Low | Medium | `HaapiStepperStepUI` + interceptor props |
| UI composition | High | Full | `HaapiStepper` + `useHaapiStepper` hook + UI components |
| Mixed | Mixed | Full | a combination of the above |

### Default — works from scratch

Renders the complete HAAPI flow UI.

```tsx
<HaapiStepper>
  <HaapiStepperStepUI />
</HaapiStepper>
```

### Styles customization

The UI components emit plain `.haapi-stepper-*` CSS class names — restyle the default UI just by
overriding those classes in your own stylesheet, no code changes needed.

```css
.haapi-stepper-button {
  background: #6200ee;
  border-radius: 8px;
}
```

### Customize with render interceptors

Keep the default UI and override one element. A render interceptor is a function that receives
the `HaapiStepper` API data for the element it targets (`currentStep`, `loading`, `error`,
`nextStep`…) and returns either a React element to use as the replacement, the API data to render the default UI, or `null` to skip the element from being rendered:

```tsx
<HaapiStepper>
  <HaapiStepperStepUI
    messageRenderInterceptor={({ message }) => {
      // Return a React element to replace, the API data to render the default, or null to skip
      return message.classList?.includes('error') ? <MyErrorBanner message={message} /> : message;
    }}
  />
</HaapiStepper>
```

Interceptors exist for the loading, error, step, actions — **form, client operation and
selector** — links, messages and form-field layers.

> 💡 **Design pattern note**: always return or pass through the API data.
>
> - **To override**: return your custom element.
> - **To delegate to the default renderer**: return the API data (`{ currentStep, history, loading, error, nextStep }`), optionally modified.
> - **To remove an element**: return `null`.

### Customize with UI composition

Build your own UI from the building blocks (`HaapiStepperActionsUI`, `HaapiStepperMessagesUI`,
`HaapiStepperLinksUI`…); `HaapiStepper` still runs the flow:

```tsx
function LoginPage() {
  const { currentStep, loading, nextStep } = useHaapiStepper();
  if (loading || !currentStep) return <p>Loading…</p>;

  const { actions, messages, links } = currentStep.dataHelpers;

  return (
    <CustomUI>
      <h1>Sign in</h1>
      <HaapiStepperMessagesUI messages={messages} />
      <HaapiStepperActionsUI actions={actions.all} onAction={nextStep} />
      <HaapiStepperLinksUI links={links} onClick={nextStep} />
    </CustomUI>
  );
}

<HaapiStepper>
  <LoginPage />
</HaapiStepper>
```

### Mixed — combine the default with your own UI

Render interceptors and UI composition aren't exclusive — mix them wherever it helps. For
example, return UI building blocks from a render interceptor to restructure *part* of the
default UI while keeping everything else: a form render interceptor that re-lays-out the same
fields, a step interceptor that swaps one step's UI, or the headless `HaapiStepper` driving a
mix of building blocks, plain HTML and third-party components.

```tsx
// Keep the default everywhere, but give the form your own layout built from the building blocks.
<HaapiStepperStepUI
  formActionRenderInterceptor={({ currentStep, nextStep }) => {
    const action = currentStep.dataHelpers.actions.form[0];
    return (
      <MyTwoColumnLayout>
        <HaapiStepperFormUI action={action} onSubmit={nextStep} />
      </MyTwoColumnLayout>
    );
  }}
/>
```

## HAAPI Stepper In Detail

### Purpose

The HAAPI Stepper is a React UI-less component designed to handle complex, multi-step authentication HAAPI workflows. It provides a declarative way to manage HAAPI (HTTP Authentication API) flows, abstracting away the complexity of step-by-step user interactions, HTTP requests, and state transitions.

### Key Features

- **Step Management**: Automatically handles navigation between authentication steps
  - **Automatic Redirections**: Seamlessly handles server-driven redirections without exposing them to consumers
  - **Automatic Polling**: Polling steps are exposed to allow custom UI, but polling requests are handled automatically based on the configured interval
  - **Automatic Continue Same**: Continue Same responses are automatically merged with the current step without exposing them to consumers
- **State Management**: Centralizes loading, error, and current step state.
- **Action Processing**: Supports multiple action types (forms, links, client operations).
- **Error Handling**: Provides comprehensive error state management with user feedback.
- **Type Safety**: Offers full TypeScript support with strict typing.


### Public API

#### HAAPI Stepper Provider Component

The `HaapiStepper` sets up the HAAPI API and makes it available to child components:

```tsx
<HaapiStepper>
  {children}
</HaapiStepper>
```

#### HAAPI Stepper Hook: `useHaapiStepper()`

The `useHaapiStepper` hook gives access to the HAAPI API to consumer components:

```tsx
const { currentStep, history, loading, error, nextStep } = useHaapiStepper();
```

**State Properties:**
- `currentStep: HaapiProviderStep | null` - The current step in the flow.
- `history: HaapiStepperHistoryEntry[]` - The steps taken so far in the flow.
- `loading: boolean` - The loading state during transitions.
- `error: HaapiStepperError | null` - Error information if something goes wrong.

**Actions:**
- `nextStep(action, payload?)` - Advances to the next step with optional form data.

### Basic Setup

#### Bootstrap Configuration

The `HaapiStepper` needs a **bootstrap configuration** — at minimum an `initialUrl` (where the flow starts) and a `haapi` driver config (the HAAPI web-driver settings).

> Only one HAAPI configuration is supported per page load — the underlying driver is a process-global singleton; switching `bootstrap.haapi` mid-page throws (see [`useHaapiFetch.ts`](./data-access/useHaapiFetch.ts)).

The bootstrap configuration supports two delivery modes, designed for two different deployment shapes:

##### Served mode (default)

When the `HaapiStepper` runs inside a server-rendered shell — like the Curity HAAPI React App — the shell injects the bootstrap configuration onto `window.__CONFIG__` *before* the SPA boots. In that case, no configuration prop is needed:

```tsx
// The shell has already injected window.__CONFIG__ — just mount the stepper.
<HaapiStepper>
  <HaapiStepperStepUI />
</HaapiStepper>
```

This is the default behavior and covers the vast majority of deployments (the HAAPI React App and any other Curity-served frontend).

##### Standalone (library) mode

When the `HaapiStepper` is consumed as a library — e.g. embedded in a third-party app or any context that doesn't set `window.__CONFIG__` — the consumer supplies the bootstrap configuration explicitly via the `config.bootstrap` prop:

```tsx
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature';
import type { HaapiStepperBootstrapConfig } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';

const bootstrapConfig: HaapiStepperBootstrapConfig = {
  initialUrl: 'https://idsvr.example.com/oauth/v2/oauth-authorize/...',
  haapi: { /* HAAPI web-driver config */ },
};

<HaapiStepper config={{ bootstrap: bootstrapConfig }}>
  <HaapiStepperStepUI />
</HaapiStepper>
```

Both modes can be mixed with `config` overrides for other tunables (e.g. `pollingInterval`, `bankIdAutostart`); see the [`HaapiStepperConfig` type](./feature/stepper/haapi-stepper.types.ts) for the full set.

### Usage

Because `HaapiStepper` does not have a UI, it can be used to build custom flow user interfaces from scratch, or it can be used in combination with the [HaapiStepperStepUI](#haapi-step-ui) component, which provides a ready-to-use, highly customizable, HAAPI UI solution.

Finally, the `HaapiStepper` can be used in combination with the built-in [HAAPI UI Components](#haapi-stepper-ui-components), which help create highly customized UIs while relying on some defaults.

Check out documentation and usage examples in [`HaapiStepper`](./feature/stepper/HaapiStepper.tsx), and in the test use cases [`HaapiStepper.spec.tsx`](./feature/stepper/HaapiStepper.spec.tsx) (the `Steps`, `Error handling`, `Loading` and `History` describe blocks) for more details.

## HAAPI Step UI

The `HaapiStepperStepUI` component provides a seamless way to implement complete HAAPI authentication flow UIs in your application, allowing extensive customization with minimal setup.

### Basic Setup

 ```tsx
  <HaapiStepper>
   <HaapiStepperStepUI />
  </HaapiStepper>
```

### Usage

Because the `HaapiStepperStepUI` handles all possible HAAPI authentication flows with proper user interfaces (UI), it is the fastest and easiest way to get HAAPI up and running in your application. It is also highly customizable and granular, allowing you to customize some aspects while keeping the defaults for the rest.

For example, swap a single element via a render interceptor while keeping the default for everything else:

```tsx
<HaapiStepper>
  <HaapiStepperStepUI
    loadingRenderInterceptor={({ loading }) => (loading ? <MySpinner /> : null)}
  />
</HaapiStepper>
```

Check out documentation and usage examples in [`HaapiStepperStepUI`](./feature/steps/HaapiStepperStepUI.tsx), and in the test use cases [`HaapiStepperStepUI.spec.tsx`](./feature/steps/HaapiStepperStepUI.spec.tsx) (the `Custom Rendering` describe blocks) for more details.

### ViewName built-in UIs

The HaapiStepperStepUI ships built-in UIs for specific HAAPI `viewName`s (`step.metadata.viewName`) that need a more tailored UI than the generic step shell can provide (e.g. the BankID requires the QR link to be lifted above the actions). They are displayed by default and can be customized like any other step by using render interceptors.

Check out documentation and usage examples in [`HaapiStepperStepUI`](./feature/steps/HaapiStepperStepUI.tsx), and the test use cases in [`HaapiStepperStepUI.spec.tsx`](./feature/steps/HaapiStepperStepUI.spec.tsx) (`describe('ViewName built-in UIs Rendering')`) for more details.

## HAAPI Stepper UI Components

The HAAPI React SDK provides some common HAAPI Stepper UI elements that help create highly customized UIs while relying on some defaults.

### Naming convention

The HAAPI Stepper UI components are the UI representation of the main HAAPI entities, named with a `UI` suffix: `HaapiStepperStepUI` displays/interacts with [`HaapiStep`](./data-access/types/haapi-step.types.ts#L48), `HaapiStepperLinkUI` with [`HaapiLink`](./data-access/types/haapi-step.types.ts#L335), and so on. Collection components use the plural form (`HaapiStepperActionsUI`, `HaapiStepperLinksUI`, `HaapiStepperMessagesUI`).

### Usage

Compose the building blocks to customize a step. For example, pass a `children` render function
to `HaapiStepperFormUI` to swap in your own username field and an Ant Design submit button, while
the built-in `HaapiStepperFormFieldUI` still manages the values and submission:

```tsx
import { Button } from 'antd';

function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions.form[0];
  if (!formAction) return null;

  return (
    <HaapiStepperFormUI action={formAction} onSubmit={nextStep}>
      {({ fields, formState }) => {
        const username = fields.find(field => field.type === HAAPI_FORM_FIELDS.USERNAME);
        const otherFields = fields.filter(field => field !== username);

        return (
          <>
            {/* Custom username field, wired to the built-in form state */}
            {username && <CustomUsernameField field={username} formState={formState} />}

            {/* Remaining fields keep the default rendering */}
            {otherFields.map(field => (
              <HaapiStepperFormFieldUI key={field.id} field={field} />
            ))}

            {/* Ant Design submit button (submits the form via type="submit") */}
            <Button type="primary" htmlType="submit">
              Sign in
            </Button>
          </>
        );
      }}
    </HaapiStepperFormUI>
  );
}
```

Check out documentation and usage examples in the links below:

* [HaapiStepperStepUI](./feature/steps/HaapiStepperStepUI.tsx)
  * [HaapiStepperActionsUI](./ui/actions/HaapiStepperActionsUI.tsx)
    * [HaapiStepperFormUI](./feature/actions/form/HaapiStepperFormUI.tsx)
      * [HaapiStepperFormFieldUI](./feature/actions/form/fields/HaapiStepperFormFieldUI.tsx)
        * [HaapiStepperTextFormFieldUI](./feature/actions/form/fields/HaapiStepperTextFormFieldUI.tsx)
        * [HaapiStepperPasswordFormFieldUI](./feature/actions/form/fields/HaapiStepperPasswordFormFieldUI.tsx)
        * [HaapiStepperCheckboxFormFieldUI](./feature/actions/form/fields/HaapiStepperCheckboxFormFieldUI.tsx)
        * [HaapiStepperSelectFormFieldUI](./feature/actions/form/fields/HaapiStepperSelectFormFieldUI.tsx)
    * [HaapiStepperSelectorUI](./feature/actions/selector/HaapiStepperSelectorUI.tsx)
    * [HaapiStepperClientOperationUI](./feature/actions/client-operation/HaapiStepperClientOperationUI.tsx)
  * [HaapiStepperMessagesUI](./ui/messages/HaapiStepperMessagesUI.tsx)
    * [HaapiStepperMessageUI](./ui/messages/HaapiStepperMessageUI.tsx)
  * [HaapiStepperLinksUI](./ui/links/HaapiStepperLinksUI.tsx)
    * [HaapiStepperLinkUI](./ui/links/HaapiStepperLinkUI.tsx)

### CSS Customization

The HAAPI UI components are styled via plain CSS class names — no CSS-in-JS, no inline styles. The components only emit class names; the actual rules live in a stylesheet shipped alongside the host application's global stylesheet. For example, in the case of the `haapi-react-app`, in `haapi-react-app/src/shared/util/css/styles.css`.

#### Importing CSS styles

Import the stylesheet once from the consuming application's entry point (e.g. `main.tsx`):

```ts
import './shared/util/css/styles.css';
```

By default, the rules in `styles.css` compose utility classes from [Curity CSS Library](https://github.com/curityio/ui-kit/tree/main/src/common/css) (imported at the top of the file) using PostCSS `@extend` — e.g. `.haapi-stepper-button { @extend .button, .button-medium, .button-primary, .w100, .mt2; }`. The components themselves only know about the `.haapi-stepper-*` class names, so consumers are free to back those classes with anything they like.

#### Overriding or extending the defaults

Because the components emit static class names, consumers can:

- **Override / Extend**: define rules for the same class names — or append additional CSS — in a separate stylesheet imported after `styles.css`.
- **Replace**: skip the default import entirely and provide your own definitions for the classes listed below — written in plain CSS, or composed from any third-party library, for example Tailwind CSS.

The Curity utility composition shown above is just how *this* project chose to implement the defaults; it is not a contract. Nothing in the components requires `@curity/ui-kit-css`, PostCSS, or `@extend`.

**Available CSS classes:**

| Class | Used by | Purpose |
|-------|---------|---------|
| `.haapi-stepper-selector` | `HaapiStepperSelectorUI` | Selector action container |
| `.haapi-stepper-authenticator-button` | `HaapiStepperFormSubmitButton` | Authenticator-selector option button (applied automatically when the action carries `authenticatorType`); combine with `.button-<authenticatorType>` (e.g. `.button-google`) to get the per-authenticator icon color |
| `.haapi-stepper-messages` | `HaapiStepperMessagesUI` | Messages container |
| `.haapi-stepper-form-field-text-input` | `HaapiStepperTextFormFieldUI` | Text input fields |
| `.haapi-stepper-form-field-text-label` | `HaapiStepperTextFormFieldUI` | Form field labels |
| `.haapi-stepper-form-field-checkbox-input` | `HaapiStepperCheckboxFormFieldUI` | Checkbox inputs |
| `.haapi-stepper-form-field-checkbox-label` | `HaapiStepperCheckboxFormFieldUI` | Checkbox-specific labels |
| `.haapi-stepper-form-field-select-input` | `HaapiStepperSelectFormFieldUI` | Select inputs |
| `.haapi-stepper-form-field-select-label` | `HaapiStepperSelectFormFieldUI` | Select-specific labels |
| `.haapi-stepper-form-field-password-wrapper` | `HaapiStepperPasswordFormFieldUI` | Password input container |
| `.haapi-stepper-form-field-password-label` | `HaapiStepperPasswordFormFieldUI` | Password label |
| `.haapi-stepper-form-field-password-input` | `HaapiStepperPasswordFormFieldUI` | Password input |
| `.haapi-stepper-form-field-password-visibility-toggle` | `HaapiStepperPasswordFormFieldUI` | Password visibility toggle button |
| `.haapi-stepper-button` | `HaapiStepperFormUI` | Primary submit buttons |
| `.haapi-stepper-button-outline` | `HaapiStepperFormUI` | Outline/cancel buttons |
| `.haapi-stepper-well` | `Well` | Styled content container |
| `.haapi-stepper-links` | `HaapiStepperLinksUI` | Links container |
| `.haapi-stepper-link` | `HaapiStepperLinkUI` | Link element |
| `.haapi-stepper-link-qr-code` | `HaapiStepperLinkUI` | QR code link figure wrapper |
| `.haapi-stepper-link-qr-code-title` | `HaapiStepperLinkUI` | QR code link figcaption |
| `.haapi-stepper-link-qr-code-button` | `HaapiStepperLinkUI` | QR code link expand button |
| `.haapi-stepper-link-qr-code-dialog` | `HaapiStepperQrCodeLinkDialog` | Fullscreen QR code dialog |
| `.haapi-stepper-link-qr-code-dialog-close-button` | `HaapiStepperQrCodeLinkDialog` | Button wrapping the expanded QR code image; closes the dialog when clicked |
| `.haapi-stepper-link-qr-code-dialog-image` | `HaapiStepperQrCodeLinkDialog` | Fullscreen QR code dialog image |
| `.haapi-stepper-actions` | `HaapiStepperActionsUI` | Actions container |
| `.haapi-stepper-heading` | `HaapiStepperMessagesUI` | Heading messages |
| `.haapi-stepper-userName` | `HaapiStepperMessagesUI` | User name display |
| `.haapi-stepper-userCode` | `HaapiStepperMessagesUI` | User code display (e.g. recovery codes) |
| `.haapi-stepper-polling-progress` | `HaapiStepperClientOperationUI` | Remaining polling time indicator (e.g. recovery codes) |
| `.haapi-stepper-error-boundary-fallback` | `DefaultErrorFallback` | Error boundary fallback container |
| `.haapi-validation-errors-container` | `HaapiStepperFormValidationErrorInputWrapper` | Wrapper around a form field that has validation errors. Receives the `.has-errors` modifier class while errors are visible |
| `.haapi-validation-errors` | `HaapiStepperFormValidationErrorInputWrapper` | Inner container that holds the list of validation error messages |
| `.haapi-validation-error` | `HaapiStepperFormValidationErrorInputWrapper` | A single validation error entry (also gets the utility classes `.red .py1`) |
| `.haapi-validation-error-description` | `HaapiStepperFormValidationErrorInputWrapper` | Validation error message text |



## Error Handling
The `HaapiStepper` implements a comprehensive error-handling strategy with multiple layers to ensure robust error management and an optimal user experience.

### Error State Management
The HAAPI stepper manages errors according to two categories: HAAPI errors and non-HAAPI errors.

#### HAAPI Errors
HAAPI errors are HAAPI `ProblemStep`s (HAAPI flow steps of type [`HAAPI_PROBLEM_STEPS`](./util/types/haapi-step.types.ts)).


HAAPI errors are classified into two groups:

```text
HaapiStepperError
├── app    (Unrecoverable)
│   ├── UnrecoverableProblemStep
│   ├── UnexpectedProblemStep
│   └── CompletedWithErrorStep
└── input  (Recoverable)
    ├── ValidationProblemStep
    └── IncorrectCredentialsProblemStep
```

**`AppError` (Unrecoverable)**
  - **Description**: Errors that cannot be resolved in the step (action form) where they originated, so they need to be handled at the application level (e.g., show a dedicated error page) and/or require restarting the stepper flow.
    * Like any other problem, they might include `UserMessages` and `Links` that need to be displayed to the user.
  - **Types**: `UnrecoverableProblemStep`, `UnexpectedProblemStep`, `CompletedWithErrorStep`. [More details here](./util/types/haapi-step.types.ts).
  - **Examples**: Authentication failed, too many attempts, session mismatches.
  - **Handling**: Displayed as toast notifications and/or a problem step UI.

**`InputError` (Recoverable)**
  - **Description**: Errors that can be resolved in the step (form) where they originated.
      * They should be handled while keeping the step's UI, providing the problem's `UserMessages` and `Links`, and allowing the user to correct the input and resubmit.
  - **Types**: `ValidationProblemStep`, `IncorrectCredentialsProblemStep`. [More details here](./util/types/haapi-step.types.ts).
  - **Examples**: Invalid form fields, incorrect credentials.
  - **Handling**: Displayed below relevant input fields for immediate correction.

**`HaapiStepperError` interface**:

```tsx
interface HaapiStepperError {
  app?: AppError | null;
  input?: InputError | null;
}
```

HAAPI errors are provided by the `useHaapiStepper` hook:

```tsx
const { error } = useHaapiStepper();
const { app, input } = error || {};
```

[`More details here`](./util/types/haapi-step.types.ts).

##### HAAPI Error Utils

###### HaapiStepperErrorNotifier
**Purpose**: Toast-based notification system for HAAPI `AppError`s, and optionally, `InputError`s:

**Example Usage**:
```tsx
<HaapiStepperErrorNotifier>
  <YourApplication />
</HaapiStepperErrorNotifier>
```

**Features:**
- Automatically shows notifications for `AppError` and, optionally, `InputError`.
- Auto-dismisses and manually dismisses with a close button.

###### HaapiStepperFormValidationErrorInputWrapper (Input-Level Errors)
**Purpose**: A field-specific error display for HAAPI validation `InputError`s:

**Example Usage**:
```tsx
<HaapiStepperFormValidationErrorInputWrapper fieldName="username">
  <input name="username" type="text" />
</HaapiStepperFormValidationErrorInputWrapper>
```

**Features:**
- Shows `InputValidationProblemStep` errors below the corresponding input fields.
- Applies the `haapi-validation-error` CSS class for styling.



#### Non-HAAPI Errors
Non-HAAPI errors are network, backend, and frontend errors that are not handled at lower levels.

The `HaapiStepper` throws them as JavaScript errors so they can be caught by the nearest React error boundary.
