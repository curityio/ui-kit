import { MEDIA_TYPES } from '../../shared/util/types/media.types';
import { HaapiFetchAction, HaapiFetchFormAction } from './types/haapi-fetch.types';
import { HaapiFormField, HTTP_METHODS } from './types/haapi-form.types';
import { FetchLike } from '@curity/identityserver-haapi-web-driver';

export type ApiRequestInit = NonNullable<Parameters<FetchLike>[1]>;

export interface ApiRequest {
  url: string;
  init: ApiRequestInit;
}

export function createApiRequest(action: HaapiFetchAction): ApiRequest {
  const isLink = 'href' in action;

  if (isLink) {
    return createRequestForUrl(action.href);
  } else {
    return createRequestForForm(action);
  }
}

/**
 * Creates a GET request for the given URL.
 * @param url the request URL
 */
export function createRequestForUrl(url: string): ApiRequest {
  return {
    url,
    init: { method: HTTP_METHODS.GET },
  };
}

/**
 * Creates a request for the given form action and values.
 *
 * If values are provided, they are used instead of the values in the form's fields - i.e. the caller has full control.
 * Any value for a name that doesn't correspond to a field in the form is ignored.
 *
 * If values are not provided, the values from the form's fields are used.
 *
 * In any case, only values that are non-null and non-undefined are included in the request.
 *
 * @param action the form action
 * @param payload the provided values
 */
export function createRequestForForm({ action, payload }: HaapiFetchFormAction): ApiRequest {
  let valueGetter: (f: HaapiFormField) => unknown;
  if (payload) {
    valueGetter =
      payload instanceof Map
        ? field => payload.get(field.name) as string
        : field => {
            const recordPayload = payload as Record<string, unknown>;
            return recordPayload[field.name];
          };
  } else {
    valueGetter = f => f.value;
  }

  const parameters = (action.model.fields ?? [])
    .map(f => [f.name, valueGetter(f)] as [string, unknown])
    .filter(([, v]) => v !== undefined && v !== null);

  const url = action.model.href;
  const method = action.model.method;
  const mediaType = action.model.type ?? MEDIA_TYPES.FORM_URLENCODED;

  const request: ApiRequest = {
    url,
    init: { method },
  };

  switch (mediaType) {
    case MEDIA_TYPES.FORM_URLENCODED:
      if (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT) {
        const body = new URLSearchParams();
        appendAll(body, parameters);
        if (body.size > 0) {
          request.init.body = body;
          request.init.headers = { 'Content-Type': MEDIA_TYPES.FORM_URLENCODED };
        }
      } else {
        // Support relative URLs by providing a default base address, which the URL constructor requires.
        const defaultBaseURLToHandleRelativeURLs = 'haapi://haapi';
        const parsedUrl = new URL(url, defaultBaseURLToHandleRelativeURLs);
        appendAll(parsedUrl.searchParams, parameters);
        request.url = `${parsedUrl.pathname}${parsedUrl.search}`;
      }
      break;

    case MEDIA_TYPES.JSON:
      if (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT) {
        request.init.body = JSON.stringify(Object.fromEntries(parameters));
        request.init.headers = { 'Content-Type': MEDIA_TYPES.JSON };
      } else {
        throw new Error(`Unsupported HTTP method for JSON media type: ${method}`);
      }
      break;

    default:
      throw new Error(`Unsupported media-type: ${mediaType}`);
  }

  return request;
}

function appendAll(urlSearchParams: URLSearchParams, parameters: [string, unknown][]): void {
  parameters.forEach(([param, value]) => {
    if (typeof value === 'string') {
      urlSearchParams.append(param, value);
    } else {
      throw new Error(`Unsupported parameter value type: ${typeof value}`);
    }
  });
}
