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

import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';

interface HaapiStepperQrCodeLinkOverlayProps {
  links?: HaapiStepperLink[];
  children: (displayQrCodeInOverlay: (link: HaapiStepperLink) => void) => ReactNode;
}

export function HaapiStepperQrCodeLinkOverlay({ children, links }: HaapiStepperQrCodeLinkOverlayProps) {
  const [displayedQrCodeKey, setDisplayedQRCode] = useState<string | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const overlayButtonRef = useRef<HTMLButtonElement>(null);

  const displayQrCodeInOverlay = useCallback((link: HaapiStepperLink) => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    const QRCodeToDisplay = getLinkKey(link);
    
    setDisplayedQRCode(QRCodeToDisplay);
  }, []);

  const handleClose = useCallback(() => {
    setDisplayedQRCode(null);
    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (displayedQrCodeKey) {
      overlayButtonRef.current?.focus();
    }
  }, [displayedQrCodeKey]);

  const currentQrCodeLink = displayedQrCodeKey
    ? (links?.find((link) => getLinkKey(link) === displayedQrCodeKey) ?? null)
    : null;

  return (
    <>
      {children(displayQrCodeInOverlay)}
      {currentQrCodeLink && (
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
            onClick={handleClose}
            aria-label="Close expanded QR code"
          >
            <img
              src={currentQrCodeLink.href}
              alt={currentQrCodeLink.title ?? 'QR code, click to close'}
              className="haapi-stepper-link-qr-code-overlay-image"
            />
          </button>
        </div>
      )}
    </>
  );
}

function getLinkKey(link: HaapiStepperLink) {
  return `${link.rel}:${link.title ?? ''}`;
}
