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
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HaapiStepperErrorNotifier } from './HaapiStepperErrorNotifier';
import { useHaapiStepper } from './HaapiStepperHook';
import { HaapiStepperAppError, HaapiStepperError, HaapiStepperInputError } from './haapi-stepper.types';

vi.mock('./HaapiStepperHook', () => ({
  useHaapiStepper: vi.fn(),
}));

const mockUseHaapiStepper = vi.mocked(useHaapiStepper);

describe('HaapiStepperErrorNotifier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHaapiStepper.mockReturnValue(createStepperResponse(null));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render when there is no error', () => {
    render(
      <HaapiStepperErrorNotifier>
        <div data-testid="children">content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.queryByTestId('haapi-error-toast')).not.toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('renders the current app error and messages', () => {
    const appError = createAppError({ title: APP_ERROR_TITLE, messages: [APP_ERROR_MESSAGE] });
    mockUseHaapiStepper.mockReturnValue(createStepperResponse({ app: appError }));

    render(
      <HaapiStepperErrorNotifier>
        <div data-testid="children">content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-toast')).toBeInTheDocument();
    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(APP_ERROR_TITLE);
    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-messages')).toHaveTextContent(APP_ERROR_MESSAGE);
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('dismisses the current error when the dismiss button is clicked', () => {
    const appError = createAppError();
    mockUseHaapiStepper.mockReturnValue(createStepperResponse({ app: appError }));

    render(
      <HaapiStepperErrorNotifier>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    fireEvent.click(screen.getByTestId('haapi-error-haapi-error-notifier-toast-dismiss'));

    expect(screen.queryByTestId('haapi-error-toast')).not.toBeInTheDocument();
  });

  it('auto-dismisses the error after the notification duration', () => {
    vi.useFakeTimers();
    const appError = createAppError();
    mockUseHaapiStepper.mockReturnValue(createStepperResponse({ app: appError }));

    render(
      <HaapiStepperErrorNotifier notificationDuration={500}>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-toast')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByTestId('haapi-error-toast')).not.toBeInTheDocument();
  });

  it('shows new errors after an earlier one has been dismissed', () => {
    const firstError = createAppError({ title: FIRST_ERROR_TITLE, messages: [FIRST_ERROR_MESSAGE] });
    const nextError = createAppError({ title: NEXT_ERROR_TITLE, messages: [NEXT_ERROR_MESSAGE] });
    let currentError: HaapiStepperError = { app: firstError };

    mockUseHaapiStepper.mockImplementation(() => createStepperResponse(currentError));

    const { rerender } = render(
      <HaapiStepperErrorNotifier>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(FIRST_ERROR_TITLE);

    fireEvent.click(screen.getByTestId('haapi-error-haapi-error-notifier-toast-dismiss'));
    expect(screen.queryByTestId('haapi-error-toast')).not.toBeInTheDocument();

    currentError = { app: nextError };
    rerender(
      <HaapiStepperErrorNotifier>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(NEXT_ERROR_TITLE);
  });

  it('renders input errors only when showInputErrorNotifications is true', () => {
    const inputError = createInputError(INPUT_ERROR_TITLE);

    mockUseHaapiStepper.mockReturnValue(createStepperResponse({ input: inputError }));

    const { rerender } = render(
      <HaapiStepperErrorNotifier>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(INPUT_ERROR_TITLE);

    rerender(
      <HaapiStepperErrorNotifier showInputErrorNotifications={false}>
        <div>content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.queryByTestId('haapi-error-toast')).not.toBeInTheDocument();
  });

  it('renders the latest error when a new error arrives without dismissing', () => {
    const firstError = createAppError({ title: FIRST_ERROR_TITLE, messages: [FIRST_ERROR_MESSAGE] });
    const nextError = createAppError({ title: NEXT_ERROR_TITLE, messages: [NEXT_ERROR_MESSAGE] });
    let currentError: HaapiStepperError = { app: firstError };

    mockUseHaapiStepper.mockImplementation(() => createStepperResponse(currentError));

    const { rerender } = render(
      <HaapiStepperErrorNotifier>
        <div data-testid="children">content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(FIRST_ERROR_TITLE);

    currentError = { app: nextError };
    rerender(
      <HaapiStepperErrorNotifier>
        <div data-testid="children">content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(NEXT_ERROR_TITLE);
    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-messages')).toHaveTextContent(NEXT_ERROR_MESSAGE);
  });

  it('uses a custom errorFormatter for the title', () => {
    const appError = createAppError({ title: APP_ERROR_TITLE });
    mockUseHaapiStepper.mockReturnValue(createStepperResponse({ app: appError }));
    const customFormatter = (error: HaapiStepperAppError | HaapiStepperInputError) => `Custom: ${error.title ?? ''}`;

    render(
      <HaapiStepperErrorNotifier errorFormatter={customFormatter}>
        <div data-testid="children">content</div>
      </HaapiStepperErrorNotifier>
    );

    expect(screen.getByTestId('haapi-error-haapi-error-notifier-toast-title')).toHaveTextContent(`Custom: ${APP_ERROR_TITLE}`);
  });
});

function createAppError({ title = DEFAULT_APP_ERROR_TITLE, messages = [DEFAULT_APP_ERROR_MESSAGE] }: { title?: string; messages?: string[] } = {}) {
  return {
    title,
    dataHelpers: {
      messages: messages.map((text, index) => ({ id: `app-message-${String(index)}`, text })),
    },
  } as unknown as HaapiStepperAppError;
}

function createInputError(title = INPUT_ERROR_TITLE) {
  return {
    title,
    dataHelpers: {
      messages: [],
    },
  } as unknown as HaapiStepperInputError;
}

function createStepperResponse(error: HaapiStepperError | null) {
  return {
    error,
  } as unknown as ReturnType<typeof useHaapiStepper>;
}

const APP_ERROR_TITLE = 'Something went wrong';
const APP_ERROR_MESSAGE = 'Details go here';
const FIRST_ERROR_TITLE = 'First error';
const FIRST_ERROR_MESSAGE = 'first';
const NEXT_ERROR_TITLE = 'Next error';
const NEXT_ERROR_MESSAGE = 'second';
const INPUT_ERROR_TITLE = 'Invalid input';
const DEFAULT_APP_ERROR_TITLE = 'Something went wrong';
const DEFAULT_APP_ERROR_MESSAGE = 'Failure';
