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

import { beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HaapiStepperFormValidationErrorInputWrapper } from './HaapiStepperFormValidationErrorInputWrapper';
import { useHaapiStepper } from '../../stepper/HaapiStepperHook';
import { createHaapiStepperApiMock } from '../../../util/tests/mocks';
import { HAAPI_PROBLEM_STEPS, type HaapiInvalidField } from '../../../data-access/types/haapi-step.types';
import type { HaapiStepperInputError } from '../../stepper/haapi-stepper.types';

describe('HaapiStepperFormValidationErrorInputWrapper', () => {
  // React reports problems such as duplicate keys through `console.error`. Spy on it for assertions.
  let consoleError: MockInstance<typeof console.error>;
  const consoleErrors = () => consoleError.mock.calls.map(call => String(call[0]));

  beforeAll(() => {
    consoleError = vi.spyOn(console, 'error');
    return () => vi.restoreAllMocks();
  });

  beforeEach(() => {
    consoleError.mockClear();
  });

  it('renders only the children when the step carries no validation error', () => {
    setInvalidFields([]);
    render(renderComponent());

    expect(screen.getByTestId(childId)).toBeInTheDocument();
    expect(screen.queryByTestId(validationErrorsTestId)).not.toBeInTheDocument();
  });

  it('renders one entry per validation error of the field, each with its own message, even when the errors share the same reason', () => {
    setInvalidFields([errors.tooShort, errors.forbiddenCharacters]);

    render(renderComponent());

    expect(renderedErrorMessages()).toEqual([errors.tooShort.detail, errors.forbiddenCharacters.detail]);

    // React reports duplicate sibling keys as an error mentioning "the same key".
    expect(consoleErrors()).toEqual([]);
  });

  it('leaves no stale message behind when the step returns a different set of errors for the field', () => {
    setInvalidFields([errors.tooShort, errors.forbiddenCharacters]);
    const { rerender } = render(renderComponent());

    setInvalidFields([errors.alreadyTaken]);
    rerender(renderComponent());

    expect(renderedErrorMessages()).toEqual([errors.alreadyTaken.detail]);
  });

  it('ignores validation errors that belong to other fields', () => {
    setInvalidFields([{ name: 'password', reason: 'missing' }]);

    render(renderComponent());

    expect(screen.getByTestId(childId)).toBeInTheDocument();
    expect(screen.queryByTestId(validationErrorsTestId)).not.toBeInTheDocument();
  });

  it('falls back to a generated message when an error has no detail', () => {
    setInvalidFields([{ name: fieldName, reason: 'missing' }]);

    render(renderComponent());

    expect(renderedErrorMessages()).toEqual([`Field '${fieldName}' is required`]);
  });
});

vi.mock('../../stepper/HaapiStepperHook', () => ({
  useHaapiStepper: vi.fn(() => ({ error: null })),
}));

const mockUseHaapiStepper = vi.mocked(useHaapiStepper);

function setInvalidFields(invalidFields: HaapiInvalidField[]): void {
  const input: HaapiStepperInputError | null = invalidFields.length
    ? {
        type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
        invalidFields,
        dataHelpers: { messages: [], links: [] },
      }
    : null;

  mockUseHaapiStepper.mockReturnValue(createHaapiStepperApiMock({ error: input ? { app: null, input } : null }));
}

const renderComponent = () => (
  <HaapiStepperFormValidationErrorInputWrapper fieldName={fieldName}>
    <div data-testid={childId} />
  </HaapiStepperFormValidationErrorInputWrapper>
);

const renderedErrorMessages = () => screen.queryAllByTestId(validationErrorTestId).map(element => element.textContent);

const childId = 'child';
const validationErrorsTestId = 'haapi-validation-errors';
const validationErrorTestId = 'haapi-validation-error';
const fieldName = 'username';
const errors = {
  tooShort: { name: fieldName, reason: 'invalidValue', detail: 'Username is too short' },
  forbiddenCharacters: { name: fieldName, reason: 'invalidValue', detail: 'Username contains forbidden characters' },
  alreadyTaken: { name: fieldName, reason: 'invalidValue', detail: 'Username is already taken' },
} satisfies Record<string, HaapiInvalidField>;
