# HAAPI stepper UI components

The HAAPI React SDK provides a set of common HAAPI Stepper UI components that let you build highly
customized UIs while still relying on the SDK's defaults. They are the building blocks
`HaapiStepperStepUI` is made of, and what you compose your own UI from with `useHaapiStepper`.

## Naming convention

The HAAPI Stepper UI components are the UI representation of the main HAAPI entities, named with a
`UI` suffix: `HaapiStepperStepUI` displays/interacts with a `HaapiStep`, `HaapiStepperLinkUI` with a
`HaapiLink`, and so on. Collection components use the plural form (`HaapiStepperActionsUI`,
`HaapiStepperLinksUI`, `HaapiStepperMessagesUI`).

## Usage

Compose the building blocks to customize a step. For example, pass a `children` render function to
`HaapiStepperFormUI` to swap in your own username field and an Ant Design submit button, while the
built-in `HaapiStepperFormFieldUI` still manages the values and submission:

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
            {// Custom username field, wired to the built-in form state }
            {username && <CustomUsernameField field={username} formState={formState} />}

            {// Remaining fields keep the default rendering }
            {otherFields.map(field => (
              <HaapiStepperFormFieldUI key={field.id} field={field} />
            ))}

            {// Ant Design submit button (submits the form via type="submit") }
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
[Try the composition in a live example](./UiComponentsCompositionUsageHaapiReactSDKPlaygroundExample.tsx)

For styling, see the CSS Customization section in the Overview.

1. HaapiStepperActionsUI
2. HaapiStepperSelectorUI
3. HaapiStepperClientOperationUI
4. HaapiStepperLinksUI
5. HaapiStepperLinkUI
6. HaapiStepperMessagesUI
7. HaapiStepperMessageUI
8. HaapiStepperErrorNotifier
9. HaapiStepperFormValidationErrorInputWrapper
