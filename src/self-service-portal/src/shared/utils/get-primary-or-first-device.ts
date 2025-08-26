import { Maybe, StringMultiValuedValue } from '@/shared/data-access/API';

export const getPrimaryOrFirstDevice = (devices?: Maybe<StringMultiValuedValue>[]) => {
  if (!devices?.length) {
    return null;
  }
  const primaryDevice = devices.find(device => device?.primary);

  return primaryDevice ? primaryDevice : devices[0];
};
