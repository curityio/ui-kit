import { MFA_STATES } from '@/pages/security/MFA/MFA';
import { OptinMfa } from '@/shared/data-access/API';

export const getMFAState = (
  optInMfaData?: OptinMfa | null
): Exclude<MFA_STATES, MFA_STATES.SETUP_INITIAL | MFA_STATES.SETUP_CONFIRMATION> => {
  if (optInMfaData?.preferences?.optOutAt) {
    return MFA_STATES.OPTED_OUT;
  } else if (optInMfaData?.registeredFactors?.factors?.length) {
    return MFA_STATES.OPTED_IN;
  } else {
    return MFA_STATES.INITIAL;
  }
};
