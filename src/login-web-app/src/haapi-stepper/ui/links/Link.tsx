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

import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';

export const Link = ({ link, onClick }: { link: HaapiStepperLink; onClick: (action: HaapiStepperLink) => void }) => {
    const isQRCodeLink = link.subtype?.startsWith('image/');

    if (isQRCodeLink) {
        return (
            <button
                type="button"
                id={link.id}
                className="haapi-stepper-link-qr-code-button"
                data-testid="qr-code-button"
                onClick={() => onClick(link)}
                aria-label="QR code, click to expand"
            >
                <figure className="haapi-stepper-link-qr-code">
                    <img src={link.href} alt={link.title ?? 'QR code, click to expand'} />
                    {link.title && <figcaption className="haapi-stepper-link-qr-code-title">{link.title}</figcaption>}
                </figure>
            </button>
        );
    }

    return (
        <button type="button" className="haapi-stepper-link" onClick={() => onClick(link)}>
            {link.title ?? link.rel}
        </button>
    );
};
