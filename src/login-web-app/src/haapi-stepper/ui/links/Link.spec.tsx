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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';
import { createMockLink } from '../../util/tests/mocks';
import { Link } from './Link';

describe('Link', () => {
  let onClick: ReturnType<typeof vi.fn<(action: HaapiStepperLink) => void>>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    onClick = vi.fn();
    user = userEvent.setup();
  });

  describe('UI', () => {
    describe('Non-image links', () => {
      it('renders a button with title', () => {
        const link = createMockLink({ title: 'Help', subtype: 'text/html' });
        render(<Link link={link} onClick={onClick} />);

        const button = screen.getByRole('button', { name: 'Help' });
        expect(button).toHaveClass('haapi-stepper-link');
      });

      it('falls back to rel when title is missing', () => {
        const link = createMockLink({ title: undefined, rel: 'help', subtype: 'text/html' });
        render(<Link link={link} onClick={onClick} />);

        expect(screen.getByRole('button', { name: 'help' })).toBeInTheDocument();
      });
    });

    describe('QR code links', () => {
      let imageLink: HaapiStepperLink;

      beforeEach(() => {
        imageLink = createMockLink({
          href: 'data:image/svg+xml;base64,abc',
          subtype: 'image/svg+xml',
          title: 'QR Code',
          rel: 'qr-code',
        });
      });

      it('renders a button wrapping the QR image', () => {
        render(<Link link={imageLink} onClick={onClick} />);

        const button = screen.getByRole('button', { name: 'QR code, click to expand' });
        expect(button).toHaveClass('haapi-stepper-link-qr-code-button');
        expect(button.querySelector('img')).toHaveAttribute('src', imageLink.href);
      });

      it('shows alt text from link title', () => {
        render(<Link link={imageLink} onClick={onClick} />);

        expect(screen.getByAltText('QR Code')).toBeInTheDocument();
      });

      it('shows visible title text from link title', () => {
        render(<Link link={imageLink} onClick={onClick} />);

        expect(screen.getByText('QR Code')).toBeInTheDocument();
      });

      it('falls back to default alt text when title is missing', () => {
        imageLink = createMockLink({
          href: 'data:image/svg+xml;base64,abc',
          subtype: 'image/svg+xml',
          title: undefined,
          rel: 'qr-code',
        });
        render(<Link link={imageLink} onClick={onClick} />);

        expect(screen.getByAltText('QR code, click to expand')).toBeInTheDocument();
      });

      it('does not render visible title when title is missing', () => {
        imageLink = createMockLink({
          href: 'data:image/svg+xml;base64,abc',
          subtype: 'image/svg+xml',
          title: undefined,
          rel: 'qr-code',
        });
        render(<Link link={imageLink} onClick={onClick} />);

        expect(screen.queryByText('qr-code')).not.toBeInTheDocument();
      });
    });
  });

  describe('Features', () => {
    it('calls onClick when a non-image link is clicked', async () => {
      const link = createMockLink({ title: 'Help', subtype: 'text/html' });
      render(<Link link={link} onClick={onClick} />);

      await user.click(screen.getByRole('button', { name: 'Help' }));
      expect(onClick).toHaveBeenCalledWith(link);
    });

    it('calls onClick when an image link is clicked', async () => {
      const imageLink = createMockLink({
        href: 'data:image/svg+xml;base64,abc',
        subtype: 'image/svg+xml',
        title: 'QR Code',
        rel: 'qr-code',
      });
      render(<Link link={imageLink} onClick={onClick} />);

      await user.click(screen.getByRole('button', { name: 'QR code, click to expand' }));
      expect(onClick).toHaveBeenCalledWith(imageLink);
    });
  });
});
