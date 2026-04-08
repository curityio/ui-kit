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

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';

interface HaapiStepperQrCodeLinkDialogProps {
  links?: HaapiStepperLink[];
  children: (displayQrCodeInDialog: (link: HaapiStepperLink) => void) => ReactNode;
}

export function HaapiStepperQrCodeLinkDialog({ children, links }: HaapiStepperQrCodeLinkDialogProps) {
  const [displayedQrCodeKey, setDisplayedQrCodeKey] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const displayQrCodeInDialog = useCallback((link: HaapiStepperLink) => {
    setDisplayedQrCodeKey(getLinkKey(link));
  }, []);

  useEffect(() => {
    if (displayedQrCodeKey) {
      dialogRef.current?.showModal();
    }
  }, [displayedQrCodeKey]);

  // BankID QR code hrefs change every second so we need to get the latest links and refresh it accordingly
  const currentQrCodeLink = displayedQrCodeKey
    ? (links?.find((link) => getLinkKey(link) === displayedQrCodeKey) ?? null)
    : null;

  const restoreFocusToOpenedQrCodeLink = (currentQrCodeLink: HaapiStepperLink | null) => {
    if (currentQrCodeLink) {
      document.getElementById(currentQrCodeLink.id)?.focus();
    }
  };

  return (
    <>
      {children(displayQrCodeInDialog)}
      <dialog
        ref={dialogRef}
        className="haapi-stepper-link-qr-code-dialog"
        data-testid="qr-code-dialog"
        aria-label="Expanded QR code"
        onClose={() => {
          setDisplayedQrCodeKey(null);
          restoreFocusToOpenedQrCodeLink(currentQrCodeLink);
        }}
        onClick={() => dialogRef.current?.close()}
      >
        {currentQrCodeLink && (
          <img
            src={currentQrCodeLink.href}
            alt={currentQrCodeLink.title ?? 'QR code, click to close'}
            className="haapi-stepper-link-qr-code-dialog-image"
          />
        )}
      </dialog>
    </>
  );
}

function getLinkKey(link: HaapiStepperLink) {
  return `${link.rel}:${link.title ?? ''}`;
}
