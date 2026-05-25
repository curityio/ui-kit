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

import type {
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperStepUIActionsRenderInterceptor,
  HaapiStepperStepUIClientOperationActionRenderInterceptor,
  HaapiStepperStepUIErrorRenderInterceptor,
  HaapiStepperStepUIFormActionRenderInterceptor,
  HaapiStepperStepUILinkRenderInterceptor,
  HaapiStepperStepUILoadingRenderInterceptor,
  HaapiStepperStepUIMessageRenderInterceptor,
  HaapiStepperStepUISelectorActionRenderInterceptor,
  HaapiStepperStepUIStepRenderInterceptor,
} from '../stepper/haapi-stepper.types';

/**
 * Props for `HaapiStepperStepUI`. Lives here (rather than in `HaapiStepperStepUI.tsx`) so the
 * `viewnames/` package can depend on the type without re-introducing a runtime cycle with
 * `HaapiStepperStepUI.tsx` (which itself imports `getViewNameBuiltInUI` from `../viewnames`).
 */
export interface HaapiStepperStepUIProps {
  /**
   * The default factory renders a spinner whenever `loading === true` *or* `currentStep` is a
   * polling step in `HAAPI_POLLING_STATUS.PENDING`.
   *
   * Consumers replacing this interceptor are therefore replacing both signals: returning a React
   * element only when `loading === true` will hide the polling-pending progress indicator. Either
   * check `currentStep` explicitly, or return the pass-through `HaapiStepperAPI` data to delegate to
   * the default factory for the cases you don't want to handle.
   */
  loadingRenderInterceptor?: HaapiStepperStepUILoadingRenderInterceptor;
  errorRenderInterceptor?: HaapiStepperStepUIErrorRenderInterceptor;
  stepRenderInterceptor?: HaapiStepperStepUIStepRenderInterceptor;
  actionsRenderInterceptor?: HaapiStepperStepUIActionsRenderInterceptor;
  formActionRenderInterceptor?: HaapiStepperStepUIFormActionRenderInterceptor;
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor;
  selectorActionRenderInterceptor?: HaapiStepperStepUISelectorActionRenderInterceptor;
  clientOperationActionRenderInterceptor?: HaapiStepperStepUIClientOperationActionRenderInterceptor;
  linkRenderInterceptor?: HaapiStepperStepUILinkRenderInterceptor;
  messageRenderInterceptor?: HaapiStepperStepUIMessageRenderInterceptor;
}
