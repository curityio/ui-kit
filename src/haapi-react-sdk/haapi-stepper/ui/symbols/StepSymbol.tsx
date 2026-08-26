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

import { resolveStepSymbol } from './step-symbol-utils';
import type { HaapiStepperStepSymbolsConfig } from '../../feature/stepper/haapi-stepper.types';

interface StepSymbolProps {
  viewName: string | undefined;
  stepSymbols: HaapiStepperStepSymbolsConfig | undefined;
}

/**
 * Renders the step symbol icon associated with the current step's HAAPI `viewName`.
 *
 * When `stepSymbols` is absent, when `viewName` is absent, or when no entry resolves, this component renders nothing.
 */
export const StepSymbol = ({ viewName, stepSymbols }: StepSymbolProps) => {
  const src = resolveStepSymbol(viewName, stepSymbols);

  if (!src) {
    return null;
  }

  return (
    <figure className="haapi-stepper-step-symbol" aria-hidden="true">
      <img className="haapi-stepper-step-symbol-image" src={src} alt="HAAPI Step Symbol" />
    </figure>
  );
};
