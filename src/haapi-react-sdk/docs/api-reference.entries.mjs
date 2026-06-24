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

/*
 * Single source of truth for the API Reference docs layout. Each leaf entry maps an SDK export
 * (`{ id, file, export }`) to a sidebar label; the grouping describes the nested sidebar tree.
 *
 * `scripts/emit-api-reference.mjs` walks the tree to generate `docs/api-reference/**`: it extracts each
 * export's TSDoc (via `scripts/extract-tsdoc.mjs`) into a Markdown page, plus a `_category_.json` per
 * (sub)category, ordered by declaration order here.
 *
 * Add or reorder API Reference pages here only — the generator follows automatically.
 */

/**
 * The API Reference structure: an ordered list of top-level items, where an item is either a leaf
 * entry (`{ id, file, export, label }`) or a group (`{ group, label, items }`) that nests further.
 * @typedef {{ id: string, file: string, export: string, label: string }} ApiReferenceEntry
 * @typedef {{ group: string, label: string, items: ApiReferenceItem[] }} ApiReferenceGroup
 * @typedef {ApiReferenceEntry | ApiReferenceGroup} ApiReferenceItem
 * @type {ApiReferenceItem[]}
 */
export const apiReferenceStructure = [
  {
    id: 'stepper',
    file: 'haapi-stepper/feature/stepper/HaapiStepper.tsx',
    export: 'HaapiStepper',
    label: 'HaapiStepper',
  },
  {
    id: 'use-haapi-stepper',
    file: 'haapi-stepper/feature/stepper/HaapiStepperHook.ts',
    export: 'useHaapiStepper',
    label: 'useHaapiStepper',
  },
  {
    id: 'step-ui',
    file: 'haapi-stepper/feature/steps/HaapiStepperStepUI.tsx',
    export: 'HaapiStepperStepUI',
    label: 'HaapiStepperStepUI',
  },
  {
    group: 'ui-components',
    label: 'UI Components',
    items: [
      {
        id: 'ui-components-overview',
        file: 'haapi-stepper/ui/index.ts',
        export: 'HaapiStepperUiComponents',
        label: 'Overview',
      },
      {
        // A documented component that also nests its parts: the form-field components are children of
        // HaapiStepperFormUI (its `index.mdx`).
        group: 'form-ui',
        label: 'HaapiStepperFormUI',
        id: 'form-ui',
        file: 'haapi-stepper/feature/actions/form/HaapiStepperFormUI.tsx',
        export: 'HaapiStepperFormUI',
        items: [
          {
            id: 'form-field-ui',
            file: 'haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI.tsx',
            export: 'HaapiStepperFormFieldUI',
            label: 'HaapiStepperFormFieldUI',
          },
          {
            id: 'text-form-field-ui',
            file: 'haapi-stepper/feature/actions/form/fields/HaapiStepperTextFormFieldUI.tsx',
            export: 'HaapiStepperTextFormFieldUI',
            label: 'HaapiStepperTextFormFieldUI',
          },
          {
            id: 'password-form-field-ui',
            file: 'haapi-stepper/feature/actions/form/fields/HaapiStepperPasswordFormFieldUI.tsx',
            export: 'HaapiStepperPasswordFormFieldUI',
            label: 'HaapiStepperPasswordFormFieldUI',
          },
          {
            id: 'select-form-field-ui',
            file: 'haapi-stepper/feature/actions/form/fields/HaapiStepperSelectFormFieldUI.tsx',
            export: 'HaapiStepperSelectFormFieldUI',
            label: 'HaapiStepperSelectFormFieldUI',
          },
          {
            id: 'checkbox-form-field-ui',
            file: 'haapi-stepper/feature/actions/form/fields/HaapiStepperCheckboxFormFieldUI.tsx',
            export: 'HaapiStepperCheckboxFormFieldUI',
            label: 'HaapiStepperCheckboxFormFieldUI',
          },
        ],
      },
      {
        id: 'selector-ui',
        file: 'haapi-stepper/feature/actions/selector/HaapiStepperSelectorUI.tsx',
        export: 'HaapiStepperSelectorUI',
        label: 'HaapiStepperSelectorUI',
      },
      {
        id: 'client-operation-ui',
        file: 'haapi-stepper/feature/actions/client-operation/HaapiStepperClientOperationUI.tsx',
        export: 'HaapiStepperClientOperationUI',
        label: 'HaapiStepperClientOperationUI',
      },
      {
        id: 'links-ui',
        file: 'haapi-stepper/ui/links/HaapiStepperLinksUI.tsx',
        export: 'HaapiStepperLinksUI',
        label: 'HaapiStepperLinksUI',
      },
      {
        id: 'messages-ui',
        file: 'haapi-stepper/ui/messages/HaapiStepperMessagesUI.tsx',
        export: 'HaapiStepperMessagesUI',
        label: 'HaapiStepperMessagesUI',
      },
      {
        id: 'error-notifier-ui',
        file: 'haapi-stepper/feature/stepper/HaapiStepperErrorNotifier.tsx',
        export: 'HaapiStepperErrorNotifier',
        label: 'HaapiStepperErrorNotifier',
      },
      {
        id: 'validation-error-wrapper-ui',
        file: 'haapi-stepper/feature/actions/form/HaapiStepperFormValidationErrorInputWrapper.tsx',
        export: 'HaapiStepperFormValidationErrorInputWrapper',
        label: 'HaapiStepperFormValidationErrorInputWrapper',
      },
    ],
  },
];

/** Whether an item is a group (has nested `items`) rather than a leaf entry. */
export const isApiReferenceGroup = item => Array.isArray(item?.items);
