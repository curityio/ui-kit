import { HaapiStepperBootstrapConfig } from '@curity/haapi-react-sdk/haapi-stepper/feature';

export interface HaapiAppConfig extends HaapiStepperBootstrapConfig {
  theme: {
    logo?: {
      path: string;
      isInsideWell: boolean;
    };
    pageSymbols?: PageSymbols;
  };
}

export interface PageSymbols {
  /** Map of full HAAPI viewName -> symbol path. Highest precedence. */
  views?: Record<string, string>;
  /** Map of plugin implementation type (e.g. `html-form`, `bankid`) -> symbol path. */
  plugins?: Record<string, string>;
  /** Fallback symbol path used when no per-view / per-plugin entry matches. */
  default?: string;
}
