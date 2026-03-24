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

import { ReactElement, isValidElement, Fragment } from 'react';

/**
 * Util function applied to a collection of items to produce the final rendering result which can be a custom React
 * element, the default rendering, or nothing for skipped items.
 *
 * The render interceptor function can return three different types of values, each with a specific purpose:
 *
 * 1. React Element (➡️ Custom UI & Behavior):
 *    When the render interceptor returns a React element, it completely replaces the default UI rendering for the item.
 *
 * 2. Item Data (➡️ Default UI & Behavior):
 *    When the render interceptor returns the item data, it delegates to the `defaultElementFactory` (passthrough behavior)
 *    - Useful for conditional UI customization based on the data (e.g. if templateArea !== 'login' return data to delegate
 *      to default rendering)
 *
 *    2.1. Customized Data (➡️ Default UI & Behavior + Custom data):
 *         When the render interceptor returns the item modified data, those modifications will be used by the `defaultElementFactory`
 *         - Useful for text modifications, property adjustments, or data enrichment (e.g., updated titles, properties)
 *
 * 3. null/undefined (➡️ Skipped Element):
 *    When the render interceptor returns null/undefined, it skips/hides the element entirely from the UI
 *    - Useful for conditional filtering of UI elements (actions of type 'example', specific links/messages...)
 *
 * @param collection - Array of objects to process (actions, links, messages, etc.)
 * @param customRenderInterceptor - Function to process each object, can return ReactElement, modified data object, null, or undefined
 * @param defaultElementFactory - Function that creates a default React element for a given object (used if interceptor passes through the data object)
 * @returns Array of React elements (custom or default)
 *
 * @example
 * // Example 1: UI Customization(React Element)
 * // Goal: Return custom Message component for messages
 * const messageElements = applyRenderInterceptor(
 *   messages,
 *   (message) => <Message message={message} />,
 * );
 *
 * @example
 * // Example 2: Original Data (Passthrough for default UI)
 * // Goal: Log login actions, else delegate to default rendering
 * const actionElements = applyRenderInterceptor(
 *   actions,
 *   (action) => {
 *     if (action.kind === HAAPI_FORM_ACTION_KINDS.LOGIN) {
 *       console.log('Login action detected', action);
 *     }
 *     return action;
 *   },
 *   (action, index) => <Form form={action} onSubmit={handleSubmit} />
 * );
 *
 * @example
 * // Example 3: Data Customization (Modified object for default UI)
 * // Goal: Modify link titles
 * const linkElements = applyRenderInterceptor(
 *   links,
 *   (link) => ({ ...link, title: `Curity: ${link.title}` }),
 *   (link, index) => <Link link={link} onClick={handleClick} />
 * );
 *
 * @example
 * // Example 4: Conditional Custom UI (React Element)
 * // Goal: Return custom ErrorMessage component for error messages, else delegate to default rendering
 * const messageElements = applyRenderInterceptor(
 *   messages,
 *   (message) => message.text.includes('error') ? <ErrorMessage message={message} /> : message,
 *   (message, index) => <p key={index}>{message.text}</p>
 * );
 *
 * @example
 * // Example 5: Skipped Elements (null/undefined to hide elements)
 * // Goal: Filter out 'cancel' actions from rendering
 * const filteredActions = applyRenderInterceptor(
 *   actions,
 *   (action) => action.kind === HAAPI_FORM_ACTION_KINDS.CANCEL ? null : action,
 *   (action, index) => <DefaultElement key={index} action={action} />
 * );
 */
export function applyRenderInterceptor<T extends object>(
  collection: T[] | undefined,
  customRenderInterceptor?: (item: T, index: number) => ReactElement | T | null | undefined,
  defaultElementFactory?: (item: T, index: number) => ReactElement | null | undefined
): ReactElement[] {
  if (!collection?.length) {
    return [];
  }

  const renderResult = collection
    .map((item, index) => {
      let element: ReactElement | null | undefined = null;
      const itemId = 'id' in item && typeof item.id === 'string' ? item.id : undefined;

      if (customRenderInterceptor) {
        const interceptorResult = customRenderInterceptor(item, index);

        if (interceptorResult === null || interceptorResult === undefined) {
          return null;
        }

        if (isValidElement(interceptorResult)) {
          element = interceptorResult;
        } else {
          element = defaultElementFactory?.(interceptorResult, index);
        }
      } else {
        element = defaultElementFactory?.(item, index);
      }

      return element ? <Fragment key={itemId}>{element}</Fragment> : null;
    })
    .filter(element => !!element);

  return renderResult;
}
