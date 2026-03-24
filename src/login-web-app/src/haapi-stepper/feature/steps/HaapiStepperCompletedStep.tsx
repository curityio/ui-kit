/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Layout } from '../../../shared/ui/Layout';
import { SuccessCheckmark } from '../../../shared/ui/SuccessCheckmark';
import { HaapiStepperCompletedStep } from '../stepper/haapi-stepper.types';

interface CompletedProps {
  step: HaapiStepperCompletedStep;
}

export function HaapiStepperCompletedStepUI({ step }: CompletedProps) {
  function continueToApplication() {
    const redirectHref = step.links?.find(link => link.rel === 'authorization-response')?.href;

    if (redirectHref) {
      window.location.href = redirectHref;
    } else {
      throw new Error('No authorization-response link found in the completed step.');
    }
  }

  return (
    <Layout>
      <div className="mx-auto mw-36 flex flex-column flex-gap-2 bg-white p3 br-8">
        <SuccessCheckmark />
        <h1 className="center">Successfully Authenticated</h1>
        <button className="button button-medium button-primary" type="button" onClick={continueToApplication}>
          Continue to application
        </button>
      </div>
    </Layout>
  );
}
