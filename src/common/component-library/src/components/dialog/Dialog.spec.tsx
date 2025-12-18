import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, CurityDialogProps } from './Dialog';
import '@testing-library/jest-dom';
import { translationFunctionMock } from '@/utils/test.ts';

const setupDialog = (props?: Partial<CurityDialogProps>) => {
  return render(
    <Dialog isOpen={true} title="Test Dialog" t={translationFunctionMock} {...props}>
      <p>Dialog content</p>
    </Dialog>
  );
};

describe('Dialog Component', () => {
  describe('Header', () => {
    it('renders the header programmatically with the correct title text', () => {
      const { rerender } = setupDialog({ showHeader: true, title: 'Header Test' });

      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Header Test');

      rerender(<Dialog isOpen={true} showHeader={false} title="Hidden Header" t={translationFunctionMock} />);

      expect(screen.queryByTestId('dialog-title')).not.toBeInTheDocument();
    });

    it('renders the subtitle programmatically with the correct subtitle text', () => {
      const { rerender } = setupDialog({ subTitle: 'Subtitle Test' });

      expect(screen.getByTestId('dialog-subtitle')).toHaveTextContent('Subtitle Test');

      rerender(<Dialog isOpen={true} t={translationFunctionMock} />);

      expect(screen.queryByTestId('dialog-subtitle')).not.toBeInTheDocument();
    });

    it('renders the close button programmatically with the correct aria-label', () => {
      const { rerender } = setupDialog({ showCloseButton: true });
      const closeButton = screen.getByTestId('dialog-close-button');

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');

      rerender(<Dialog isOpen={true} showCloseButton={false} t={translationFunctionMock} />);

      expect(screen.queryByTestId('dialog-close-button')).not.toBeInTheDocument();
    });

    it('calls closeCallback when the close button is clicked', () => {
      const closeCallback = vi.fn();

      setupDialog({ closeCallback });

      fireEvent.click(screen.getByTestId('dialog-close-button'));

      expect(closeCallback).toHaveBeenCalled();
    });
  });

  describe('Footer', () => {
    it('renders the footer with the correct buttons and texts', () => {
      const { rerender } = setupDialog({
        showFooter: true,
        showActionButton: true,
        actionButtonText: 'SaveTitle',
        showCancelButton: true,
        cancelButtonText: 'CancelTitle',
      });

      const actionButton = screen.getByTestId('dialog-action-button');
      const cancelButton = screen.getByTestId('dialog-cancel-button');

      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toHaveTextContent('SaveTitle');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent('CancelTitle');

      rerender(
        <Dialog
          isOpen={true}
          showFooter={false}
          showActionButton={true}
          showCancelButton={true}
          t={translationFunctionMock}
        />
      );

      expect(screen.queryByTestId('dialog-action-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dialog-cancel-button')).not.toBeInTheDocument();

      rerender(
        <Dialog
          isOpen={true}
          showFooter={true}
          showActionButton={false}
          showCancelButton={false}
          t={translationFunctionMock}
        />
      );

      expect(screen.queryByTestId('dialog-action-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dialog-cancel-button')).not.toBeInTheDocument();
    });

    it('disables the action button when isActionButtonDisabled is true', () => {
      setupDialog({ showActionButton: true, isActionButtonDisabled: true });

      const actionButton = screen.getByTestId('dialog-action-button');

      expect(actionButton).toBeDisabled();
    });

    it('calls actionButtonCallback when the action button is clicked', () => {
      const actionButtonCallback = vi.fn();

      setupDialog({ showActionButton: true, actionButtonCallback });

      fireEvent.click(screen.getByTestId('dialog-action-button'));

      expect(actionButtonCallback).toHaveBeenCalled();
    });

    it('calls cancelButtonCallback and closes the dialog when the cancel button is clicked', () => {
      const cancelButtonCallback = vi.fn();

      setupDialog({ showCancelButton: true, cancelButtonCallback });

      fireEvent.click(screen.getByTestId('dialog-cancel-button'));

      expect(cancelButtonCallback).toHaveBeenCalled();
    });

    it('calls the closeCallback when the action button is clicked if closeDialogOnActionButtonClick is true', async () => {
      const closeCallback = vi.fn();
      setupDialog({ showActionButton: true, closeDialogOnActionButtonClick: true, closeCallback });

      fireEvent.click(screen.getByTestId('dialog-action-button'));

      expect(closeCallback).toHaveBeenCalled();

      setupDialog({ showActionButton: true, closeDialogOnActionButtonClick: true });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    it('calls the closeCallback when the cancel button is clicked if closeDialogOnCancelButtonClick is true', () => {
      const closeCallback = vi.fn();
      setupDialog({ showCancelButton: true, closeDialogOnCancelButtonClick: true, closeCallback });

      fireEvent.click(screen.getByTestId('dialog-cancel-button'));

      expect(closeCallback).toHaveBeenCalled();
    });
  });

  describe('Content', () => {
    it('renders the dialog content with the correct text', () => {
      setupDialog();

      const content = screen.getByTestId('dialog-content');

      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Dialog content');
    });
  });
});
