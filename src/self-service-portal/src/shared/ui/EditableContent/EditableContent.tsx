import React, { JSX, useEffect, useRef, useState } from 'react';
import { Button } from '../Button';
import { IconGeneralEdit } from '@icons';
import { useOutsideClick } from '@shared/hooks/useOutsideClick.tsx';
import { useTranslation } from 'react-i18next';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

interface EditableContentProps {
  children: JSX.Element;
  onSave?: (value: string) => void;
  onCancel?: (value: string) => void;
  uiConfigResources?: UI_CONFIG_RESOURCES[];
  uiConfigAllowedOperations?: UI_CONFIG_OPERATIONS[];
}

export const EditableContent = ({
  children,
  onSave,
  onCancel,
  uiConfigResources,
  uiConfigAllowedOperations,
}: EditableContentProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [originalValue, setOriginalValue] = useState<string>(children.props.value);
  const [tempValue, setTempValue] = useState<string>(children.props.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(inputRef, () => {
    if (inputRef.current && document.activeElement !== inputRef.current) handleCancel();
  });

  useEffect(() => {
    setTempValue(children.props.value);
    if (!isEditing) {
      setOriginalValue(children.props.value);
    }
  }, [children.props.value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setOriginalValue(tempValue);
    if (inputRef.current && onSave) {
      onSave(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(children.props.value);
    setIsEditing(false);
    if (onCancel) {
      onCancel(originalValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(event.target.value);

    if (children.props?.onChange) {
      children.props.onChange(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }

    if (children.props?.onKeyDown) {
      children.props.onKeyDown(event);
    }
  };

  const editableContentButtonElement = (
    <Button
      className="button-tiny button-primary-outline"
      icon={<IconGeneralEdit width={18} height={18} />}
      onClick={() => setIsEditing(true)}
      data-testid="edit-button"
      aria-label={isEditing ? t('Editing') : t('Edit')}
    />
  );
  const editModeElement = (
    <div className="flex flex-center flex-gap-2">
      {React.cloneElement(children, {
        ref: inputRef,
        value: tempValue,
        onKeyDown: handleKeyDown,
        onChange: handleChange,
      })}
      <Button
        title={t('Save')}
        className="button-small button-primary"
        onClick={handleSave}
        data-testid="save-button"
        aria-label={t('Save')}
        style={{ height: 'var(--form-field-height)' }}
      />
    </div>
  );
  const readModeElement = (
    <div className="flex flex-center flex-gap-2">
      {children?.props?.label && <label>{children.props.label}</label>}
      <p className="m0">{tempValue}</p>
      {uiConfigResources ? (
        <UiConfigIf resources={uiConfigResources} allowedOperations={uiConfigAllowedOperations}>
          {editableContentButtonElement}
        </UiConfigIf>
      ) : (
        editableContentButtonElement
      )}
    </div>
  );
  const editableContentElement = (
    <div className="flex flex-column flex-gap-1">{isEditing ? editModeElement : readModeElement}</div>
  );

  return uiConfigResources ? (
    <UiConfigIf resources={uiConfigResources} allowedOperations={[UI_CONFIG_OPERATIONS.READ]}>
      {editableContentElement}
    </UiConfigIf>
  ) : (
    editableContentElement
  );
};
