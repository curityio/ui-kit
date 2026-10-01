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

import { FetchLike } from '@curity/identityserver-haapi-web-driver';
import { MEDIA_TYPES } from './types/media.types';
import { ApiRequest } from './haapi-fetch-utils';
import { HaapiStep } from './types/haapi-step.types';

export async function sendHaapiFetchRequest(request: ApiRequest, haapiFetch: FetchLike): Promise<HaapiStep> {
  const response = await haapiFetch(request.url, request.init);
  const mediaType = response.headers.get('Content-Type');

  switch (mediaType) {
    case MEDIA_TYPES.AUTH:
    case MEDIA_TYPES.PROBLEM: {
      return (await response.json()) as HaapiStep;
    }

    default:
      throw new Error(`Unsupported media type ${mediaType ?? ''}`);
  }
}
