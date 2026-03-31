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

import { useCallback, useEffect, useRef } from 'react';
import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';

interface HaapiStepperQrCodeLinkOverlayProps {
  link: HaapiStepperLink;
  onClose: () => void;
}

export function HaapiStepperQrCodeLinkOverlay({ link, onClose }: HaapiStepperQrCodeLinkOverlayProps) {
  const overlayButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    overlayButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="haapi-stepper-link-qr-code-overlay"
      data-testid="qr-code-overlay"
      role="dialog"
      aria-label="Expanded QR code"
      onKeyDown={handleKeyDown}
    >
      <button
        ref={overlayButtonRef}
        type="button"
        className="haapi-stepper-link-qr-code-overlay-button"
        data-testid="qr-code-overlay-button"
        onClick={onClose}
        aria-label="Close expanded QR code"
      >
        <img
          src={link.href}
          alt={link.title ?? 'QR code, click to close'}
          className="haapi-stepper-link-qr-code-overlay-image"
        />
      </button>
    </div>
  );
}
