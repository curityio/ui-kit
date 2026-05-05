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

import { useEffect, useState } from 'react';

/**
 * Returns whether the device exposes a user-verifying platform authenticator (Touch ID,
 * Windows Hello, Android biometrics, …).
 */
export function useIsWebAuthnPlatformAuthenticatorAvailable(): boolean | undefined {
  const [available, setAvailable] = useState<boolean>();

  useEffect(() => {
    let cancelled = false;

    if (isWebAuthnPlatformAuthenticatorApiAvailable) {
      void resolveAvailability().then(value => {
        if (!cancelled) {
          setAvailable(value);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return available;
}

const isWebAuthnPlatformAuthenticatorApiAvailable =
  typeof PublicKeyCredential === 'function' && 'isUserVerifyingPlatformAuthenticatorAvailable' in PublicKeyCredential;

const resolveAvailability = (): Promise<boolean> => {
  if (!isWebAuthnPlatformAuthenticatorApiAvailable) {
    return Promise.resolve(false);
  }
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};
