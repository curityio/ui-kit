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
 * Single source of truth for the "Examples" docs section — a curated tour of the customization examples,
 * grouped by customization kind. Each leaf `id` is an `examples/<id>.tsx` basename (the key in the
 * generated `examples.json`); `scripts/emit-examples.mjs` walks this to generate `docs/examples/**`, one
 * `<DocExample id=…/>` playground page per leaf.
 *
 * Render-interceptor examples are ordered to match the `HaapiStepperStepUI` interceptor props
 * (loading → error → step → actions → formAction → formField → selector → clientOperation → link →
 * message), with the step-targeting examples collected at the bottom.
 *
 * Add or reorder Examples pages here only. Excludes examples already shown on API Reference pages
 * (field renderings, DefaultRendering, MessagesRendering, error components, UseHaapiStepperHook) and the
 * preview-chrome files (ExamplePreviewer/StepSelect/StepDataDetails/HaapiStepperPreview).
 */

/*
 * Third-party npm deps (antd, reCAPTCHA, …) are auto-detected from each example's imports by
 * `build-sandpack-sdk.mjs` and installed by `<DocExample>`, so entries don't declare them here.
 */

/**
 * @typedef {{ id: string, label: string }} ExampleEntry
 * @typedef {{ group: string, label: string, items: ExampleItem[] }} ExampleGroup
 * @typedef {ExampleEntry | ExampleGroup} ExampleItem
 * @type {ExampleItem[]}
 */
export const examplesStructure = [
  {
    group: 'render-interceptors',
    label: 'Render interceptors',
    items: [
      { id: 'LoadingRenderInterceptorExample', label: 'Loading' },
      { id: 'ErrorPositioningRenderInterceptorExample', label: 'Error positioning' },
      { id: 'ActionsRenderInterceptorExample', label: 'Actions' },
      { id: 'FormFieldRenderInterceptorExample', label: 'Form field' },
      { id: 'SelectorRenderInterceptorExample', label: 'Selector action' },
      { id: 'SelectorReorderRenderInterceptorExample', label: 'Selector action (reorder)' },
      { id: 'ClientOperationRenderInterceptorExample', label: 'Client operation' },
      { id: 'LinkRenderInterceptorExample', label: 'Link' },
      { id: 'MessageRenderInterceptorExample', label: 'Message' },
      // Step-targeting render interceptors, collected at the bottom.
      { id: 'StepRenderInterceptorExample', label: 'Step' },
      { id: 'StepDataRenderInterceptorExample', label: 'Step: data customization' },
      { id: 'StepBehaviorRenderInterceptorExample', label: 'Step: behavior customization' },
      { id: 'ComposedLayoutRenderInterceptorExample', label: 'Step: mixed with UI composition' },
    ],
  },
  {
    group: 'ui-composition',
    label: 'UI composition',
    items: [
      { id: 'BuildingBlocksUICompositionExample', label: 'Full customization with UI Components' },
      { id: 'FormUICompositionExample', label: 'Form customization' },
      { id: 'FullCustomizationUICompositionExample', label: 'Full customization with library' },
    ],
  },
  {
    group: 'advanced',
    label: 'Advanced',
    items: [
      { id: 'TabbedAuthenticatorUICompositionExample', label: 'Tabbed authenticator selector' },
      { id: 'CaptchaRenderInterceptorExample', label: 'Captcha on login form' },
    ],
  },
];

/** Whether an item is a group (has nested `items`) rather than a leaf entry. */
export const isExamplesGroup = item => Array.isArray(item?.items);
