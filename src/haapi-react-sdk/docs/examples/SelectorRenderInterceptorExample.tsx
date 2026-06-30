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

import { Select } from 'antd';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import type {
  HaapiStepperFormAction,
  HaapiStepperStepUISelectorActionRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: swap the authenticator selector for a searchable Ant Design
 * `Select` via `selectorActionRenderInterceptor`, built from the action's own options. Choosing one drives
 * the flow forward through `nextStep`, exactly like the built-in selector would.
 */
const selectorActionRenderInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({ action, nextStep }) => {
  const options = action.model.options as HaapiStepperFormAction[];

  return (
    <Select
      showSearch
      autoFocus
      placeholder="Search for a sign-in method…"
      style={{ width: '100%' }}
      optionFilterProp="label"
      options={options.map(option => ({ label: option.title, value: option.id }))}
      onChange={(value: string) => {
        const option = options.find(candidate => candidate.id === value);
        if (option) {
          nextStep(option);
        }
      }}
    />
  );
};

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <HaapiStepperStepUI selectorActionRenderInterceptor={selectorActionRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}
