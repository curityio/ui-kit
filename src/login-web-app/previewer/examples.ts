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

import {
  HaapiActionStep,
  HaapiCompletedStep,
  HaapiErrorStep,
} from '../src/haapi-stepper/data-access/types/haapi-step.types';
import { authenticatorExamples } from './examples.authenticators';
import { authenticationActionExamples } from './examples.authentication-actions';
import { formExamples } from './examples.forms';
import { oauthExamples } from './examples.oauth';
import { authenticationExamples } from './examples.authentication';

// Types used to define examples
export interface PreviewExampleData {
  title: string;
  step: HaapiActionStep | HaapiCompletedStep;
  error?: HaapiErrorStep | null;
}
export interface PreviewSectionData {
  title: string;
  items: PreviewItemData[];
}
export type PreviewItemData = PreviewSectionData | PreviewExampleData;

// Types used to consume examples, with IDs automatically assigned
type WithId<T> = T & { id: string };
export type PreviewExample = WithId<PreviewExampleData>;
export interface PreviewSection extends WithId<PreviewSectionData> {
  items: PreviewItem[];
}
export type PreviewItem = PreviewSection | PreviewExample;

const _examples: PreviewItemData[] = [
  {
    title: 'Authenticators',
    items: authenticatorExamples,
  },
  {
    title: 'Authentication Actions',
    items: authenticationActionExamples,
  },
  {
    title: 'Authentication',
    items: authenticationExamples,
  },
  {
    title: 'OAuth',
    items: oauthExamples,
  },
  {
    title: 'Forms',
    items: formExamples,
  },
];

function assignIds(item: PreviewItemData, parentId: string): PreviewItem {
  const itemId = `${parentId}/${item.title}`;
  if ('items' in item) {
    return {
      ...item,
      id: itemId,
      items: item.items.map(it => assignIds(it, itemId)),
    };
  } else {
    return {
      ...item,
      id: itemId,
    };
  }
}

export const examples: PreviewItem[] = _examples.map(it => assignIds(it, ''));

function flattenExamples(items: PreviewItem[]): PreviewExample[] {
  return items.flatMap(item => {
    if ('items' in item) {
      return flattenExamples(item.items);
    } else {
      return [item];
    }
  });
}

export const examplesById = new Map<string, PreviewExample>(
  flattenExamples(examples).map(example => [example.id, example])
);
