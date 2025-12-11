import { expect } from 'vitest';
import { findByTestId } from '@testing-library/react';
import * as queries from '@testing-library/dom/types/queries';
import { TranslationFunction } from '@/types/util.type.ts';

/**
 * It turns out to be tricky to test/tell if an async element was not eventually added to the DOM because of a condition (e.g. UiConfigIf checks).
 * findByTestId() can wait for async element to appear, but it will throw an error if the element is not found.
 * This function uses exactly that implementation detail to check if the element was not eventually found.
 */
export const expectAsyncElementNotToBeFoundByTestId = async (testId: string) => {
  await expect(findByTestId(document.body, testId)).rejects.toThrow();
};

export const expectAsyncElementNotToBeFound = async (element: ReturnType<queries.FindByRole>) => {
  await expect(element).rejects.toThrow();
};

export const translationFunctionMock: TranslationFunction = (key: string) => {
  if (key === 'delete-row') {
    return 'delete row';
  }
  return key;
};
