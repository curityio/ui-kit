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

import { cloneElement, Fragment, ReactElement, useState } from 'react';
import type { HaapiStepperConfig } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { DEFAULT_EXAMPLE, EXAMPLES, HAAPI_EXAMPLE } from './catalog';
import { StepSelect } from './StepSelect';
import { StepDataDetails } from './StepDataDetails';
import { bootstrapForStep } from './config';
import { AutoSubmitForm } from './AutoSubmitForm';

/**
 * Wraps a HAAPI example in the docs preview chrome — a step selector and a collapsed step-data view — and
 * provides **served-mode** config: it points `window.__CONFIG__` at the selected step's bootstrap (the
 * host app's job in production) before the wrapped `<HaapiStepper>` mounts, so the example itself stays
 * clean served code (`<HaapiStepper><HaapiStepperStepUI /></HaapiStepper>`, no `config` prop).
 *
 * `defaultStep` sets which step the preview opens on; the reader can switch to any other from the
 * selector.
 */
export function ExamplePreviewer({
  children,
  defaultStep = DEFAULT_EXAMPLE,
  autoSubmit = false,
  showStepSelect = false,
}: {
  children: ReactElement<{ config?: Partial<HaapiStepperConfig> }>;
  /**
   * Which example the preview opens on — a {@link HAAPI_EXAMPLE} key (a customization-pinned step for
   * single-step examples, or a showcase step). Defaults to the first browsable showcase entry.
   */
  defaultStep?: string;
  /** Submit the step on mount so its post-submit error shows by default (e.g. error-component examples). */
  autoSubmit?: boolean;
  /**
   * Show the "Step to display" selector. Opt-in: only for examples meant to be browsed across steps
   * (default UI, whole-step customizations). Examples pinned to one step omit it — switching would render
   * nothing custom.
   */
  showStepSelect?: boolean;
}) {
  const [step, setStep] = useState<string>(defaultStep);

  // Runs during render, before the child mounts, so it's set in time — an effect would be too late.
  window.__CONFIG__ = bootstrapForStep(step);

  // Sandbox-safe config injected into every example at runtime (the visible snippet stays clean served
  // code): autostart off (never fire a real WebAuthn/BankID ceremony on mount, which would render nothing
  // while the browser prompts) and auto-redirect off (a completed flow shows the completed step instead of
  // trying to follow an authorization-response link to a real redirect URI the mock doesn't have).
  const example = cloneElement(children, { config: SANDBOX_CONFIG });

  // Auto-submit when the prop opts in, or when the catalog entry marks the example as one whose whole
  // point is the post-submit state (e.g. an authentication or validation error).
  const shouldAutoSubmit = autoSubmit || EXAMPLES[step as HAAPI_EXAMPLE].autoSubmit === true;

  return (
    <>
      {showStepSelect && <StepSelect value={step} onChange={setStep} />}

      {/* key={step} remounts the example on change so the stepper re-reads window.__CONFIG__. */}
      <Fragment key={step}>{shouldAutoSubmit ? <AutoSubmitForm>{example}</AutoSubmitForm> : example}</Fragment>

      {/* The selected step's HAAPI data, collapsed below the rendered UI. */}
      <StepDataDetails step={EXAMPLES[step as HAAPI_EXAMPLE].step} />
    </>
  );
}

const SANDBOX_CONFIG: Partial<HaapiStepperConfig> = {
  webAuthnAutostart: false,
  bankIdAutostart: false,
  autoRedirectOnAuthenticationComplete: false,
};
