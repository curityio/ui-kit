import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EditableContent } from './EditableContent.tsx';
import { describe, expect, it, vi } from 'vitest';
import { UiConfigProvider } from '../../../ui-config/data-access/UiConfigProvider.tsx';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '../../../ui-config/typings.ts';
import { expectAsyncElementNotToBeFound } from '../../utils/test.ts';
import * as utils from '../../../ui-config/utils/ui-config-if-utils.tsx';
import { mockUiConfigProvider } from '../../utils/test.ts';

describe('EditableContent', () => {
  const onSaveMock = vi.fn();
  const onChangeMock = vi.fn();
  const testId = 'editable-content';
  const editButtonTestId = 'edit-button';
  const testValue = 'initialValue';
  const inputField = <input data-testid={testId} value={testValue} onChange={e => onChangeMock(e.target.value)} />;
  const renderComponent = (children = inputField) => {
    render(
      <UiConfigProvider>
        <EditableContent onSave={onSaveMock}>{children}</EditableContent>
      </UiConfigProvider>
    );
  };

  describe('Read Mode (default)', () => {
    beforeEach(() => {
      mockUiConfigProvider();
    });

    it('should display the initial value', async () => {
      renderComponent();
      expect(await screen.findByText(testValue)).toBeTruthy();
    });

    it('should display the Edit Button', async () => {
      renderComponent();
      expect(await screen.findByTestId('edit-button')).toBeInTheDocument();
    });

    describe('UiConfigIf integration', () => {
      it('should display only its content when there are read permissions for the associated resources', async () => {
        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]);

        render(
          <UiConfigProvider>
            <EditableContent
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.READ]}
            >
              {inputField}
            </EditableContent>
          </UiConfigProvider>
        );

        expect(await screen.findByText(testValue)).toBeInTheDocument();
        await expectAsyncElementNotToBeFound(screen.findByText(editButtonTestId));
      });

      it('should display its content and the edit button when there are edit permissions for the associated resources', async () => {
        vi.spyOn(utils, 'useCurrentRouteResources').mockReturnValue([UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]);

        render(
          <UiConfigProvider>
            <EditableContent
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
            >
              {inputField}
            </EditableContent>
          </UiConfigProvider>
        );

        expect(await screen.findByText(testValue)).toBeInTheDocument();
        expect(await screen.findByTestId(editButtonTestId)).toBeInTheDocument();
      });

      it('should hide its content when no `read` permissions for the associated resources', () => {
        render(
          <UiConfigProvider>
            <EditableContent
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
              onSave={onSaveMock}
            >
              {inputField}
            </EditableContent>
          </UiConfigProvider>
        );

        expect(screen.queryByText(testValue)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    it('should update its value when it changes', async () => {
      renderComponent();
      fireEvent.click(await screen.findByTestId('edit-button'));
      const input = await screen.findByRole('textbox');
      fireEvent.change(input, { target: { value: 'updated' } });
      expect(input).toHaveValue('updated');
      fireEvent.click(await screen.findByTestId('save-button'));
      expect(onSaveMock).toHaveBeenCalledWith('updated');
    });

    it('should display the children input with the value when the Edit Button is clicked', async () => {
      renderComponent();
      fireEvent.click(await screen.findByTestId('edit-button'));
      expect(await screen.findByRole('textbox')).toHaveValue(testValue);
    });

    it('should focus the input when the Edit Button is clicked', async () => {
      renderComponent();
      fireEvent.click(await screen.findByTestId('edit-button'));
      const input = await screen.findByRole('textbox');
      expect(input).toHaveFocus();
    });

    describe('Save', () => {
      it('should display the Save Button', async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        expect(await screen.findByTestId('save-button')).toBeInTheDocument();
      });

      it('should trigger the Save callback when the Save Button is clicked', async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        const input = await screen.findByRole('textbox');
        fireEvent.change(input, { target: { value: 'new value' } });
        fireEvent.click(await screen.findByTestId('save-button'));
        expect(onSaveMock).toHaveBeenCalledWith('new value');
      });

      it("should trigger the Save callback when the 'Enter' key is pressed", async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        const input = await screen.findByRole('textbox');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(onSaveMock).toHaveBeenCalledWith(testValue);
      });

      it('should hide the input and display the value when the Save callback is triggered', async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        fireEvent.click(await screen.findByTestId('save-button'));
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText(testValue)).toBeInTheDocument();
      });
    });

    describe('Cancel', () => {
      it("should hide the input and display the value when the 'Esc' key is pressed", async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        const input = await screen.findByRole('textbox');
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
        await expectAsyncElementNotToBeFound(screen.findByRole('textbox'));
        expect(await screen.findByText(testValue)).toBeInTheDocument();
      });

      it('should hide the input and display the value when the user clicks outside of the input', async () => {
        renderComponent();
        fireEvent.click(await screen.findByTestId('edit-button'));
        fireEvent.click(document.body);
        waitFor(() => {
          expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });
        waitFor(() => {
          expect(screen.getByText(content => content.includes(testValue))).toBeInTheDocument();
        });
      });
    });
  });

  describe('Parent callbacks', () => {
    it("should trigger the input's onKeyDown callback when any key is pressed", async () => {
      const onKeyDownMock = vi.fn();
      const childrenWithKeyDown = (
        <input value="initial" onKeyDown={e => onKeyDownMock((e.target as HTMLInputElement).value)} />
      );
      renderComponent(childrenWithKeyDown);
      fireEvent.click(await screen.findByTestId('edit-button'));
      const input = await screen.findByRole('textbox');
      fireEvent.change(input, { target: { value: 'updated' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(onKeyDownMock).toHaveBeenCalledWith('updated');
    });

    it("should trigger the input's onChange callback when any key is pressed", async () => {
      renderComponent();
      fireEvent.click(await screen.findByTestId('edit-button'));
      const input = await screen.findByRole('textbox');
      fireEvent.change(input, { target: { value: 'updated' } });
      expect(input).toHaveValue('updated');
      expect(onChangeMock).toHaveBeenCalledWith('updated');
    });
  });
});
