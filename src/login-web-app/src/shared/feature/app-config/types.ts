import { HaapiStepperBootstrapConfig } from '../../../haapi-stepper/feature';

export interface HaapiAppConfig extends HaapiStepperBootstrapConfig {
  theme: {
    logo?: {
      path: string;
      isInsideWell: boolean;
    };
  };
}
