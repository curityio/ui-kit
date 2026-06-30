# Overview

The HAAPI React SDK is a set of React components that fully manages HAAPI authentication
flows in the frontend. It works out of the box with minimal setup and lets you customize the UI only as far as you need.

[Browse the HAAPI step catalog](docs/examples/HaapiStepperPreview.tsx)

<!-- docs:skip -->

## Documentation

This README is the source for the SDK's interactive documentation. 

> 📖 **[Read the interactive docs online](https://curityio.github.io/ui-kit/haapi-react-sdk/docs/)**, or run it locally from the repo root:

```shell
npm run docs
```

<!-- /docs:skip -->

## Previewer

Browse the default UI for every HAAPI authentication step: pick a step to see how `HaapiStepperStepUI`
renders it out of the box, then edit the code to see your changes live.

[Browse the HAAPI step catalog](docs/examples/HaapiStepperPreview.tsx)

## Glossary

- **Flow**: sequence of steps that results in either a successful authentication (`HAAPI_STEPS.COMPLETED_WITH_SUCCESS`) or an error/failure (`HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR`).
- **Step**: A single stage in the authentication flow, often represented as a screen (e.g., a login page). A step can be composed of actions, links, and messages.
  - [Step types](./haapi-stepper/data-access/types/haapi-step.types.ts)
- **Action**: instructions about how to progress to the next step in the authentication flow. Actions often require specific user input and change the state of the authentication (e.g., submitting a form). There are three kinds of action: **form** (e.g. a username/password login form), **client operation** (e.g. a BankID or WebAuthn operation) and **selector** (e.g. choosing an authenticator).
  - [Action types](./haapi-stepper/data-access/types/haapi-action.types.ts)
- **Link**:  instructions about how to navigate to an alternative but related path (e.g. starting a password reset flow from the main authentication step)
  - [Link](./haapi-stepper/data-access/types/haapi-step.types.ts#L335)
- **Message**: Text that provides context to the user about the state of the authentication flow and possible interaction options (e.g., validation errors, warnings, or instructions).
  - [Message](./haapi-stepper/data-access/types/haapi-step.types.ts#L324)

Check out the following HAAPI documentation for in-depth technical details:

* [Browserless Login Solution](https://curity.io/product/user-journey-orchestration/browserless-login/)
* [What is Hypermedia Authentication API](https://curity.io/resources/learn/what-is-hypermedia-authentication-api/)
* [HAAPI Data Model](https://curity.io/docs/haapi-data-model/latest/).


## Main actors

`HaapiStepper` **runs the flow**; everything else is about **how you render it**.

### `HaapiStepper` — runs the flow

A headless provider that manages multi-step HAAPI authentication workflows. Wrap your app in it.

```tsx
<HaapiStepper>
  {/* your UI goes here */}
</HaapiStepper>
```

[Read more](/api-reference/stepper)

### `useHaapiStepper()` — read & advance the flow

A hook that exposes the ongoing `HaapiStepper` authentication flow: its current step and state
(`currentStep`, `loading`, `error`), the `history` of steps taken so far, and a `nextStep`
function to advance it.

```tsx
const { currentStep, loading, error, history, nextStep } = useHaapiStepper();
```

[Read more](/api-reference/use-haapi-stepper)

### `HaapiStepperStepUI` — the default UI

Renders any HAAPI flow step out of the box, providing a complete default **opinionated** login UI. It is the fastest way to get HAAPI flows running, and the starting point you customize from.

```tsx
<HaapiStepper>
  <HaapiStepperStepUI />
</HaapiStepper>
```

[See example](docs/examples/DefaultRendering.tsx)

[Read more](/api-reference/step-ui)

### HAAPI stepper UI components — the building blocks

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

[See example](docs/examples/StepBuildingBlocks.tsx)

[Read more](/api-reference/ui-components/ui-components-overview)

## Customization

Start with the zero-effort default and adopt customization **only as far as you need**.

| | Effort | Control | What you use | Best for |
|---|--------|---------|--------------|----------|
| Default | None | Low | `HaapiStepper` + `HaapiStepperStepUI` | getting HAAPI flows running out of the box |
| Styles customization | Very low | Look only | CSS classes (`.haapi-stepper-*`) | restyling the default UI |
| Render interceptors | Low | Medium | `HaapiStepperStepUI` + interceptor props | tweaking the default UI |
| UI composition | High | Full | `HaapiStepper` + `useHaapiStepper` hook + UI components | custom layout, grouping, complex/behaviour |
| Mixed | Mixed | Full | a combination of the above | the default UI with localized custom parts |

### Default — works from scratch

Renders the complete HAAPI flow UI.

```tsx
<HaapiStepper>
  <HaapiStepperStepUI />
</HaapiStepper>
```

[See example](docs/examples/DefaultRendering.tsx)

### Styles customization

The UI components emit plain `.haapi-stepper-*` CSS class names — restyle the default UI just by
overriding those classes in your own stylesheet, no code changes needed.

```css
.haapi-stepper-button {
  background: #6200ee;
  border-radius: 8px;
}
```

[Restyle the button with CSS](docs/examples/StylesButtonCustomization.tsx)

### CSS customization

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

<details>
<summary>Available CSS classes</summary>

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

</details>

### Customize with render interceptors

Render interceptors are the programmatic way to customize the default step UI elements — loader, error, step, actions (form, client operation, selector), links, messages, and form fields.

Each is a function that receives the `HaapiStepper` API data for the target UI element (`currentStep`, `loading`, `error`, `nextStep`…) and returns either a React element to replace the default UI element, the API data to render the default UI element, or `null` to skip the element from being rendered:

```tsx
<HaapiStepper>
  <HaapiStepperStepUI
    // Replace the default message with a custom callout.
    // (Return the `message` data instead to keep the default rendering, or `null` to hide it.)
    messageRenderInterceptor={({ message }) => <div className="my-callout">📨 {message.text}</div>}
  />
</HaapiStepper>
```

[See example](docs/examples/MessageRenderInterceptorExample.tsx)

> 💡 **Design pattern note**: always return or pass through the API data.
>
> - **To override**: return your custom element.
> - **To delegate to the default renderer**: return the API data (`{ currentStep, history, loading, error, nextStep }`), optionally modified.
> - **To remove an element**: return `null`.

### Customize with UI composition

The declarative path to build UIs from scratch. Use it for what the API doesn't expose as elements — grouping (fieldsets/tabs), cross-element layouts, inserting your own elements, and behaviour customizations (tabs, multi-step wizards). Best for layout and complex customizations.

Each HAAPI entity has a corresponding UI component (`HaapiStepperActionsUI`, `HaapiStepperMessagesUI`, `HaapiStepperLinksUI`…). `HaapiStepper` still runs the flow:

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

[See example](docs/examples/BuildingBlocksUICompositionExample.tsx)

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

[See example](docs/examples/FormUICompositionExample.tsx)
