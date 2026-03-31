# HAAPI Frontend Library

## Conceptual Glossary

- **Flow**: sequence of steps that results in either a successful authentication (`HAAPI_STEPS.COMPLETED_WITH_SUCCESS`) or an error/failure (`HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR`).
- **Step**: A single stage in the authentication flow, often represented as a screen (e.g., a login page). A step can be composed of actions, links, and messages.
  - [Step types](./util/types/haapi-step.types.ts)
- **Action**: instructions about how to progress to the next step in the authentication flow. Actions often require specific user input and change the state of the authentication (e.g., submitting a form).
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

The HAAPI Frontend Library is a set of React components that provides:
 - A built-in, full management of HAAPI flows in the frontend with minimal setup:
  ```tsx
    <HaapiStepper>
      <HaapiUIStep />
    </HaapiStepper>
  ```
 - A simple toolbox to fully customize HAAPI flows in the frontend, composed of the [HAAPI Stepper](#haapi-stepper), [HAAPI UI Step](#haapi-ui-step), and [HAAPI UI Components](#haapi-ui-components).

## HAAPI Stepper

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
const { currentStep, loading, error, nextStep } = useHaapiStepper();
```

**State Properties:**
- `currentStep: HaapiProviderStep | null` - The current step in the flow.
- `loading: boolean` - The loading state during transitions.
- `error: HaapiStepperError | null` - Error information if something goes wrong.

**Actions:**
- `nextStep(action, payload?)` - Advances to the next step with optional form data.

### Basic Setup

```tsx
function App() {
  return (
    <HaapiStepper>
      <HaapiComponentExample />
    </HaapiStepper>
  );
}
```

### Usage

Because `HaapiStepper` does not have a UI, it can be used to build custom flow user interfaces from scratch, or it can be used in combination with the [HaapiUIStep](#haapi-ui-step) component, which provides a ready-to-use, highly customizable, HAAPI UI solution.

Finally, the `HaapiStepper` can be used in combination with the built-in [HAAPI UI Components](#haapi-ui-components), which help create highly customized UIs while relying on some defaults.

Check out [the HaapiStepper documentation and usage examples](./feature/stepper/HaapiStepper.tsx)

## HAAPI UI Step

The `HaapiUIStep` component provides a seamless way to implement complete HAAPI authentication flow UIs in your application, allowing extensive customization with minimal setup.

### Basic Setup

 ```tsx
  <HaapiStepper>
   <HaapiUIStep />
  </HaapiStepper>
```

### Usage

Because the `HaapiUIStep` handles all possible HAAPI authentication flows with proper user interfaces (UI), it is the fastest and easiest way to get HAAPI up and running in your application. It is also highly customizable and granular, allowing you to customize some aspects while keeping the defaults for the rest.

Check out [the HaapiUIStep documentation and usage examples](./feature/steps/HaapiUIStep.tsx).



## HAAPI UI Components

The HAAPI Frontend Library provides some common HAAPI UI elements that help create highly customized UIs while relying on some defaults.

### Usage

Check out documentation and usage examples in the links below:

- [Form](./feature/actions/form/Form.tsx)
* [Selector](./feature/actions/selector/HaapiSelector.tsx)
* [ClientOperation](./feature/actions/client-operation/ClientOperation.tsx)
* [Messages](./ui/messages/Messages.tsx)
* [Links](./ui/links/Links.tsx)
* [Link](./ui/links/Link.tsx)

### CSS Customization

The HAAPI UI components reference the CSS classes listed below but do not ship any styles themselves — they are intentionally unstyled at the library level. It is the consuming application's responsibility to customize styles and define these classes.

**Available CSS classes:**

| Class | Used by | Purpose |
|-------|---------|---------|
| `.haapi-stepper-selector` | `HaapiSelector` | Selector action container |
| `.haapi-stepper-messages` | `Messages` | Messages container |
| `.haapi-form-input` | `Form` | Text/password input fields |
| `.haapi-form-checkbox` | `Form` | Checkbox inputs |
| `.haapi-form-field-label` | `Form` | Form field labels |
| `.haapi-form-field-checkbox-label` | `Form` | Checkbox-specific labels |
| `.haapi-stepper-button` | `Form` | Primary submit buttons |
| `.haapi-stepper-button-outline` | `Form` | Outline/cancel buttons |
| `.haapi-stepper-well` | `Well` | Styled content container |
| `.haapi-stepper-links` | `Links` | Links container |
| `.haapi-stepper-link` | `Link` | Link element |
| `.haapi-stepper-link-qr-code` | `Link` | Image link figure wrapper |
| `.haapi-stepper-link-qr-code-title` | `Link` | Image link figcaption |
| `.haapi-stepper-link-qr-code-button` | `Link` | Image link expand button |
| `.haapi-stepper-link-qr-code-overlay` | `Link` | Fullscreen image overlay container |
| `.haapi-stepper-link-qr-code-overlay-button` | `Link` | Fullscreen overlay dismiss button |
| `.haapi-stepper-link-qr-code-overlay-image` | `Link` | Fullscreen overlay image |
| `.haapi-stepper-actions` | `Actions` | Actions container |
| `.haapi-stepper-heading` | `Messages` | Heading messages |
| `.haapi-stepper-userName` | `Messages` | User name display |
| `.haapi-stepper-userCode` | `Messages` | User code display (e.g. recovery codes) |
| `.haapi-stepper-polling-progress` | `ClientOperation` | Remaining polling time indicator (e.g. recovery codes) |
| `.haapi-stepper-error-boundary-fallback` | `DefaultErrorFallback` | Error boundary fallback container |


## Error Handling
The `HaapiStepper` implements a comprehensive error-handling strategy with multiple layers to ensure robust error management and an optimal user experience.

### Error State Management
The HAAPI stepper manages errors according to two categories: HAAPI errors and non-HAAPI errors.

#### HAAPI Errors
HAAPI errors are HAAPI `ProblemStep`s (HAAPI flow steps of type [`HAAPI_PROBLEM_STEPS`](./util/types/haapi-step.types.ts)).


HAAPI errors are classified into two groups:

**`AppError` (Unrecoverable)**
  - **Description**: Errors that cannot be resolved in the step (action form) where they originated, so they need to be handled at the application level (e.g., show a dedicated error page) and/or require restarting the stepper flow.
    * Like any other problem, they might include `UserMessages` and `Links` that need to be displayed to the user.
  - **Types**: `UnrecoverableProblemStep`, `UnexpectedProblemStep`, `CompletedWithErrorStep`. [More details here](./util/types/haapi-step.types.ts).
  - **Examples**: Authentication failed, too many attempts, session mismatches.
  - **Handling**: Displayed as toast notifications and/or a problem step UI.

**`InputErrors` (Recoverable)**
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

###### HaapiErrorNotifier
**Purpose**: Toast-based notification system for HAAPI `AppError`s, and optionally, `InputErrors`s:

**Example Usage**:
```tsx
<HaapiErrorNotifier>
  <YourApplication />
</HaapiErrorNotifier>
```

**Features:**
- Automatically shows notifications for `AppError` and, optionally, `InputError`.
- Auto-dismisses and manually dismisses with a close button.

###### HaapiValidationErrorInputWrapper (Input-Level Errors)
**Purpose**: A field-specific error display for HAAPI validation `InputError`s:

**Example Usage**:
```tsx
<HaapiValidationErrorInputWrapper fieldName="username">
  <input name="username" type="text" />
</HaapiValidationErrorInputWrapper>
```

**Features:**
- Shows `InputValidationProblemStep` errors below the corresponding input fields.
- Applies the `haapi-validation-error` CSS class for styling.



#### Non-HAAPI Errors
Non-HAAPI errors are network, backend, and frontend errors that are not handled at lower levels.

The `HaapiStepper` throws them as JavaScript errors so they can be caught by the nearest React error boundary.


##### Non-HAAPI Error Utils

###### useThrowErrorToAppErrorBoundary
**Purpose**: A React hook that provides a function to rethrow async errors so they can be caught by React error boundaries.

> **Why is this needed?** React error boundaries only catch errors during rendering, in lifecycle methods, and in constructors. They **do not** catch errors in async operations like event handlers, promises, or `setTimeout` callbacks. This hook bridges that gap by allowing you to manually throw errors that will be caught by the nearest `ErrorBoundary`.

**Example Usage**:
```tsx
function MyComponent() {
  const throwErrorToAppErrorBoundary = useThrowErrorToAppErrorBoundary();

  // Example 1: Async operation error rethrowing
  const handleAsyncAction = async () => {
    try {
      const response = await fetch('/api/critical-data');
    } catch (error) {
      // Rethrow async error so the ErrorBoundary can catch it and display the fallback UI
      throwErrorToAppErrorBoundary('Failed to load critical data. Please refresh the page.');
    }
  };

  // Example 2: Promise rejection rethrowing
  const handlePromiseAction = () => {
    someAsyncOperation()
      .catch(error => {
        // Rethrow async error so the ErrorBoundary can catch it and display the fallback UI
        throwErrorToAppErrorBoundary('Operation failed unexpectedly');
      });
  };
}
```

**Integration with HAAPI Stepper**:
The HAAPI Stepper Provider uses this hook to handle non-HAAPI errors (network failures, unexpected server responses) by throwing them to the application-level error boundary rather than trying to handle them locally.
