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

import { MEDIA_TYPES } from '../../shared/util/types/media.types';
import haapiFetch from './haapi-fetch-initializer';
import { createApiRequest } from './haapi-fetch-utils';
import { HaapiFetchAction } from './types/haapi-fetch.types';
import { HaapiStep } from './types/haapi-step.types';

export async function sendHaapiFetchRequest(action: HaapiFetchAction): Promise<HaapiStep> {
  const request = createApiRequest(action);
  const response = await haapiFetch(request.url, request.init);
  const mediaType = response.headers.get('Content-Type');

  switch (mediaType) {
    case MEDIA_TYPES.AUTH:
    case MEDIA_TYPES.PROBLEM: {
      const JSONResponse = (await response.json()) as HaapiStep;

      return JSONResponse;
    }

    default:
      throw new Error(`Unsupported media type ${mediaType ?? ''}`);
  }
}
