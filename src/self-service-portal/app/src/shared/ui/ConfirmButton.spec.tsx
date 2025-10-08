/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmButton } from '@/shared/ui/ConfirmButton';
import { IconGeneralClose } from '@curity-ui-kit/icons';

describe('ConfirmButton', () => {
  it('opens dialog when clicked', () => {
    render(<ConfirmButton title="Delete" data-testid="confirm-button" />);
    const button = screen.getByTestId('confirm-button');

    fireEvent.click(button);

    expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
  });

  it('renders button with provided title', () => {
    render(<ConfirmButton title="Delete" data-testid="confirm-button" />);

    const button = screen.getByTestId('confirm-button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Delete');
  });

  it('renders icon in button if icon prop is provided', () => {
    render(
      <ConfirmButton title="Delete" icon={<IconGeneralClose width={18} height={18} />} data-testid="confirm-button" />
    );

    const button = screen.getByTestId('confirm-button');

    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('displays correct dialog message', () => {
    const customMessage = 'Are you sure you want to delete this item?';

    render(<ConfirmButton title="Delete" dialogMessage={customMessage} data-testid="confirm-button" />);

    fireEvent.click(screen.getByTestId('confirm-button'));

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('handles confirm action correctly', async () => {
    const onConfirmMock = vi.fn();

    render(<ConfirmButton title="Delete" onConfirm={onConfirmMock} data-testid="confirm-button" />);

    fireEvent.click(screen.getByTestId('confirm-button'));
    fireEvent.click(screen.getByTestId('dialog-action-button'));

    expect(onConfirmMock).toHaveBeenCalled();
    expect(screen.queryByTestId('dialog-header')).not.toBeInTheDocument();
  });

  it('handles cancel action correctly', async () => {
    const onCancelMock = vi.fn();

    render(<ConfirmButton title="Delete" onCancel={onCancelMock} data-testid="confirm-button" />);

    fireEvent.click(screen.getByTestId('confirm-button'));
    fireEvent.click(screen.getByTestId('dialog-cancel-button'));

    expect(onCancelMock).toHaveBeenCalled();
    expect(screen.queryByTestId('dialog-header')).not.toBeInTheDocument();
  });

  describe('Dialog Config', () => {
    it('disables confirm button when isActionButtonDisabled is true', () => {
      render(
        <ConfirmButton title="Delete" dialogConfig={{ isActionButtonDisabled: true }} data-testid="confirm-button" />
      );

      fireEvent.click(screen.getByTestId('confirm-button'));

      expect(screen.getByTestId('dialog-action-button')).toBeDisabled();
    });

    it('applies dialogConfig props correctly', () => {
      const actionButtonText = 'Proceed';
      const cancelButtonText = 'Abort';
      const customTitle = 'Custom Dialog Title';
      const closeButtonCallback = vi.fn();

      render(
        <ConfirmButton
          title="Delete"
          dialogConfig={{
            title: customTitle,
            actionButtonText,
            cancelButtonText,
            closeCallback: closeButtonCallback,
          }}
        />
      );

      fireEvent.click(screen.getByTestId('confirm-button'));

      expect(screen.getByTestId('dialog-title')).toHaveTextContent(customTitle);
      expect(screen.getByTestId('dialog-action-button')).toHaveTextContent(actionButtonText);
      expect(screen.getByTestId('dialog-cancel-button')).toHaveTextContent(cancelButtonText);

      fireEvent.click(screen.getByTestId('dialog-cancel-button'));

      expect(closeButtonCallback).toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('confirm-button'));
      fireEvent.click(screen.getByTestId('dialog-close-button'));

      expect(closeButtonCallback).toHaveBeenCalled();
    });
  });
});
