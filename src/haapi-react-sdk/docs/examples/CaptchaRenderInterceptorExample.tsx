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

import { useState } from 'react';
import { GoogleReCaptchaCheckbox, GoogleReCaptchaProvider } from '@google-recaptcha/react';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { HaapiStepperFormSubmitButton } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormSubmitButton';
import { HAAPI_FORM_ACTION_KINDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import type {
  HaapiStepperFormAction,
  HaapiStepperNextStep,
  HaapiStepperStepUIFormActionRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

// Google's public reCAPTCHA *test* key — works on any domain and always issues a token, so the widget is
// interactive in this sandbox. Swap it for your own site key in production.
const RECAPTCHA_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

/**
 * UI Customization with render interceptor: insert an element in the middle of the form and gate
 * submission on it. `formActionRenderInterceptor`
 * receives the typed form action and the API's `nextStep`; when the action's `kind` is `LOGIN`, render a
 * custom form that drops a reCAPTCHA v2 checkbox between the fields and the submit button, and keep the
 * submit button disabled until reCAPTCHA issues a token.
 */
const captchaLoginFormInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action, nextStep }) => {
  if (action.kind !== HAAPI_FORM_ACTION_KINDS.LOGIN) {
    return action;
  }

  return <LoginFormWithCaptcha action={action} onSubmit={nextStep} />;
};

function LoginFormWithCaptcha({
  action,
  onSubmit,
}: {
  action: HaapiStepperFormAction;
  onSubmit: HaapiStepperNextStep<HaapiStepperFormAction>;
}) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  return (
    <GoogleReCaptchaProvider type="v2-checkbox" siteKey={RECAPTCHA_TEST_SITE_KEY}>
      <HaapiStepperFormUI action={action} onSubmit={onSubmit}>
        {({ fields }) => (
          <>
            {fields.map(field => (
              <HaapiStepperFormFieldUI key={field.name} field={field} />
            ))}
            <div className="haapi-stepper-captcha flex flex-column flex-center flex-gap-2" style={{ margin: '1rem 0' }}>
              {!captchaToken && <GoogleReCaptchaCheckbox onChange={setCaptchaToken} />}
            </div>
            <HaapiStepperFormSubmitButton disabled={!captchaToken} />
          </>
        )}
      </HaapiStepperFormUI>
    </GoogleReCaptchaProvider>
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.HTML_FORM_LOGIN}>
      <HaapiStepper>
        <HaapiStepperStepUI formActionRenderInterceptor={captchaLoginFormInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}
