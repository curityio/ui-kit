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

import { ReactElement, useCallback, useState } from 'react';
import { HaapiStepperLink, HaapiStepperNextStep } from '../../feature/stepper/haapi-stepper.types';
import { applyRenderInterceptor } from '../../util/generic-render-interceptor';
import { defaultHaapiStepperLinkElementFactory } from './defaultHaapiStepperLinkElementFactory';
import { HaapiStepperQrCodeLinkOverlay } from './HaapiStepperQrCodeLinkOverlay';

interface LinksProps {
  links?: HaapiStepperLink[];
  onClick: HaapiStepperNextStep<HaapiStepperLink>;
  renderInterceptor?: (link: HaapiStepperLink) => ReactElement | HaapiStepperLink | null | undefined;
}

/**
 * @description
 * # LINKS COMPONENT
 *
 * Renders HAAPI link actions and supports optional render interception
 * so callers can tweak or fully override individual items, forwarding the
 * link option clicked to the provided `onClick` handler.
 *
 * @example
 * ```tsx
 * function HaapiComponentExample() {
 *   const { currentStep, nextStep } = useHaapiStepper();
 *   const links = currentStep?.dataHelpers.links;
 *
 *   return { <Links links={links} onClick={nextStep} /> };
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 */
export function Links({ links, onClick, renderInterceptor }: LinksProps) {
  const [showQrCodeExpanded, setShowQrCodeExpanded] = useState(false);

  const currentQRCodeLink = links?.find((link) => link.subtype?.startsWith('image/'));

  const handleExpandQrCode = useCallback(() => {
    setShowQrCodeExpanded(true);
  }, []);

  const handleCloseQrCodeOverlay = useCallback(() => {
    setShowQrCodeExpanded(false);
  }, []);
  
  const showQRCodeOverlay = showQrCodeExpanded && currentQRCodeLink;
  const linkElements = applyRenderInterceptor(links, renderInterceptor, (link) =>
    defaultHaapiStepperLinkElementFactory(link, onClick, handleExpandQrCode)
  );
  

  return linkElements.length ? (
    <div className="haapi-stepper-links" data-testid="links">
      {linkElements}
      {showQRCodeOverlay && (
        <HaapiStepperQrCodeLinkOverlay link={currentQRCodeLink} onClose={handleCloseQrCodeOverlay} />
      )}
    </div>
  ) : null;
}
