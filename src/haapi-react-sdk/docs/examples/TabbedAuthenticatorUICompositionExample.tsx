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

import { useRef, useState } from 'react';
import { Tabs } from 'antd';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { useHaapiFetch } from '@curity/haapi-react-sdk/haapi-stepper/data-access/useHaapiFetch';
import { HAAPI_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import { HAAPI_ACTION_CLIENT_OPERATIONS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import type { HaapiFetchAction } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-fetch.types';
import type {
  HaapiStepperFormAction,
  HaapiStepperStep,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';
import { MOCK_HAAPI } from './config';

/**
 * UI Customization with UI composition: render an authenticator selector as Ant Design tabs (BankID first,
 * then the rest). The select step is cached in a ref so the tabs stay mounted after a selection advances
 * the flow. Switching tabs cancels the in-progress authenticator (`sendHaapiFetchRequest`) and fetches the
 * newly-selected one (`nextStep`); the active tab renders the fetched step through a nested
 * `HaapiStepperStepUI`. BankID needs an explicit start, so its tab shows a button.
 */
function TabbedAuthenticatorSelector() {
  const { currentStep, nextStep } = useHaapiStepper();
  const { sendHaapiFetchRequest } = useHaapiFetch(MOCK_HAAPI);
  const cachedSelectStep = useRef<HaapiStepperStep | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isCustomAuthenticatorSelectStep(currentStep)) {
    cachedSelectStep.current = currentStep;
  }

  const selectStep = cachedSelectStep.current;
  if (!selectStep) {
    return <div>Loading authenticators…</div>;
  }

  const selectorAction = selectStep.dataHelpers.actions?.selector[0];
  const options = (selectorAction?.model.options ?? []) as HaapiStepperFormAction[];
  const bankIdOption = options.find(isBankId);
  const tabOptions = bankIdOption ? [bankIdOption, ...options.filter(option => option !== bankIdOption)] : options;
  const activeTabOption = tabOptions[activeIndex];

  const selectTabOption = (index: number) => {
    setActiveIndex(index);

    // Cancel the authenticator currently in progress before switching. `sendHaapiFetchRequest` takes the raw
    // `HaapiFetchFormAction`, so the enriched stepper action is cast back to it.
    const cancelAction = currentStep?.dataHelpers.actions?.formByKind.cancel?.[0];
    if (cancelAction) {
      void sendHaapiFetchRequest({ action: cancelAction } as HaapiFetchAction);
    }

    // BankID is started explicitly from its own tab; the others fetch their step immediately.
    const selectedOption = tabOptions[index];
    if (!isBankId(selectedOption)) {
      nextStep(selectedOption);
    }
  };

  return (
    <Tabs
      activeKey={String(activeIndex)}
      onChange={(key: string) => selectTabOption(Number(key))}
      items={tabOptions.map((option, index) => ({
        key: String(index),
        label: option.title,
        children:
          index === activeIndex ? (
            <HaapiStepperStepUI
              stepRenderInterceptor={api => {
                if (api.loading && api.currentStep.type !== HAAPI_STEPS.POLLING) {
                  return <div>Loading…</div>;
                }

                // BankID must be started explicitly, so its tab shows a button until the wait step arrives.
                if (isBankId(activeTabOption) && !isBankIdWaitStep(api.currentStep)) {
                  return (
                    <button type="button" className="haapi-stepper-button" onClick={() => nextStep(activeTabOption)}>
                      Use {activeTabOption.title}
                    </button>
                  );
                }

                // Delegate to the default rendering for the fetched authenticator step.
                return api;
              }}
            />
          ) : null,
      }))}
    />
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.CUSTOM_AUTHENTICATOR_SELECT}>
      <HaapiStepper>
        <TabbedAuthenticatorSelector />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

// The selector step that drives this example (its options include BankID).
const CUSTOM_SELECT_TEMPLATE_AREA = 'lwa-dev';
const CUSTOM_SELECT_VIEW_NAME = 'views/select-authenticator/index';
// The PENDING step BankID lands on once started.
const BANKID_WAIT_VIEW_NAME = 'authenticator/bankid/wait/index';

const isCustomAuthenticatorSelectStep = (step: HaapiStepperStep | null) =>
  !!step &&
  step.type === HAAPI_STEPS.AUTHENTICATION &&
  step.metadata?.templateArea === CUSTOM_SELECT_TEMPLATE_AREA &&
  step.metadata.viewName === CUSTOM_SELECT_VIEW_NAME;

const isBankId = (option: HaapiStepperFormAction) =>
  option.properties?.authenticatorType === HAAPI_ACTION_CLIENT_OPERATIONS.BANKID;

const isBankIdWaitStep = (step: HaapiStepperStep) => step.metadata?.viewName === BANKID_WAIT_VIEW_NAME;
