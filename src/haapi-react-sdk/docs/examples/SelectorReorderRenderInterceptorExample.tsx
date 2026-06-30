/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HAAPI_ACTION_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import type {
  HaapiStepperAction,
  HaapiStepperStepUISelectorActionRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Data Customization with render interceptor: reorder the authenticator selector with
 * `selectorActionRenderInterceptor` — return the action with its `model.options` reordered, and the
 * default selector UI renders the new order.
 *
 * The selector's `model.options` is a discriminated union `HaapiStepperAction[]` — narrowing on
 * `option.subtype === HAAPI_ACTION_TYPES.FORM` gives TypeScript the form-action shape, so
 * `properties.authenticatorType` is reachable with no `as` cast.
 */
const usernameFirstSelectorInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({ action }) => {
  const isUsername = (option: HaapiStepperAction) =>
    option.subtype === HAAPI_ACTION_TYPES.FORM && option.properties?.authenticatorType === 'html-form';

  return {
    ...action,
    model: {
      ...action.model,
      options: [
        ...action.model.options.filter(isUsername),
        ...action.model.options.filter(option => !isUsername(option)),
      ],
    },
  };
};

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <HaapiStepperStepUI selectorActionRenderInterceptor={usernameFirstSelectorInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}
