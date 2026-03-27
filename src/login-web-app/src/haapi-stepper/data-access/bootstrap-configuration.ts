import { HaapiConfiguration } from '@curity/identityserver-haapi-web-driver';

export interface BootstrapConfiguration {
  initialUrl?: string;
  haapi: HaapiConfiguration;
}

// @ts-expect-error window.__CONFIG__ is not declared on the Window type
const _configuration = window.__CONFIG__ as BootstrapConfiguration | undefined;
if (!_configuration) {
  throw new Error('Configuration not set');
}

export const configuration = _configuration;
