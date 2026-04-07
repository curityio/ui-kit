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
import { Links } from './Links';

describe('Links', () => {
  let onClick: ReturnType<typeof vi.fn<(action: HaapiStepperLink) => void>>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    onClick = vi.fn();
    user = userEvent.setup();
  });

  describe('UI', () => {
    describe('Default rendering', () => {
      it('renders nothing when links is undefined', () => {
        render(<Links links={undefined} onClick={onClick} />);

        expect(screen.queryByTestId('links')).not.toBeInTheDocument();
      });

      it('renders nothing when links is empty', () => {
        render(<Links links={[]} onClick={onClick} />);

        expect(screen.queryByTestId('links')).not.toBeInTheDocument();
      });

      it('renders link buttons', () => {
        const links = [
          createMockLink({ title: 'Register', subtype: 'text/html', rel: 'register' }),
          createMockLink({ title: 'Help', subtype: 'text/html', rel: 'help' }),
        ];
        render(<Links links={links} onClick={onClick} />);

        expect(screen.getByTestId('links')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
      });

    });

    describe('Custom rendering', () => {
      it('data customization: render interceptor modifies link data before default rendering', () => {
        const links = [createMockLink({ title: 'Original', subtype: 'text/html', rel: 'help' })];
        render(
          <Links
            links={links}
            onClick={onClick}
            renderInterceptor={(link) => ({ ...link, title: 'Modified' })}
          />
        );

        expect(screen.queryByRole('button', { name: 'Original' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Modified' })).toBeInTheDocument();
      });

      it('UI customization: render interceptor replaces default rendering with custom element', () => {
        const links = [createMockLink({ title: 'Default', subtype: 'text/html', rel: 'help' })];
        render(
          <Links
            links={links}
            onClick={onClick}
            renderInterceptor={(link) => <a href={link.href} data-testid="custom-link">{link.title}</a>}
          />
        );

        expect(screen.queryByRole('button', { name: 'Default' })).not.toBeInTheDocument();
        expect(screen.getByTestId('custom-link')).toHaveTextContent('Default');
      });

      it('render interceptor hides links by returning null', () => {
        const links = [createMockLink({ title: 'Hidden', subtype: 'text/html', rel: 'help' })];
        render(<Links links={links} onClick={onClick} renderInterceptor={() => null} />);

        expect(screen.queryByTestId('links')).not.toBeInTheDocument();
      });

      it('render interceptor can selectively customize specific links', () => {
        const links = [
          createMockLink({ title: 'Register', subtype: 'text/html', rel: 'register' }),
          createMockLink({ title: 'Help', subtype: 'text/html', rel: 'help' }),
        ];
        render(
          <Links
            links={links}
            onClick={onClick}
            renderInterceptor={(link) =>
              link.rel === 'register' ? <span data-testid="custom-register">Custom</span> : link
            }
          />
        );

        expect(screen.getByTestId('custom-register')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
      });
    });
  });

  describe('Features', () => {
    describe('Link navigation', () => {
      it('calls onClick when a link button is clicked', async () => {
        const link = createMockLink({ title: 'Register', subtype: 'text/html', rel: 'register' });
        render(<Links links={[link]} onClick={onClick} />);

        await user.click(screen.getByRole('button', { name: 'Register' }));

        expect(onClick).toHaveBeenCalledWith(link);
      });
    });

    describe('QR code dialog', () => {
      let links: HaapiStepperLink[];

      beforeEach(() => {
        links = [
          createMockLink({
            href: 'data:image/svg+xml;base64,abc',
            subtype: 'image/svg+xml',
            title: 'QR Code',
            rel: 'qr-code',
          }),
          createMockLink({ title: 'Cancel', subtype: 'text/html', rel: 'cancel' }),
        ];
      });

      it('opens dialog when QR button is clicked', async () => {
        render(<Links links={links} onClick={onClick} />);

        await user.click(screen.getByTestId('qr-code-button'));

        expect(screen.getByTestId('qr-code-dialog')).toHaveAttribute('open');
      });

      it('does not call onClick when QR button is clicked', async () => {
        render(<Links links={links} onClick={onClick} />);

        await user.click(screen.getByTestId('qr-code-button'));

        expect(onClick).not.toHaveBeenCalled();
      });

      it('closes dialog when QR image is clicked', async () => {
        render(<Links links={links} onClick={onClick} />);

        await user.click(screen.getByTestId('qr-code-button'));
        expect(screen.getByTestId('qr-code-dialog')).toHaveAttribute('open');

        await user.click(screen.getByTestId('qr-code-dialog').querySelector('img')!);
        expect(screen.getByTestId('qr-code-dialog')).not.toHaveAttribute('open');
      });

      it('dialog uses the current image href from links prop', async () => {
        const { rerender } = render(<Links links={links} onClick={onClick} />);

        await user.click(screen.getByTestId('qr-code-button'));

        const updatedLinks = [
          createMockLink({
            href: 'data:image/svg+xml;base64,UPDATED',
            subtype: 'image/svg+xml',
            title: 'QR Code',
            rel: 'qr-code',
          }),
          links[1],
        ];
        rerender(<Links links={updatedLinks} onClick={onClick} />);

        const dialogImg = screen.getByTestId('qr-code-dialog').querySelector('img')!;
        expect(dialogImg).toHaveAttribute('src', 'data:image/svg+xml;base64,UPDATED');
      });

      it('dialog stays open across re-renders with new links', async () => {
        const { rerender } = render(<Links links={links} onClick={onClick} />);

        await user.click(screen.getByTestId('qr-code-button'));
        expect(screen.getByTestId('qr-code-dialog')).toHaveAttribute('open');

        const updatedLinks = [
          createMockLink({
            href: 'data:image/svg+xml;base64,NEW',
            subtype: 'image/svg+xml',
            title: 'QR Code',
            rel: 'qr-code',
          }),
          links[1],
        ];
        rerender(<Links links={updatedLinks} onClick={onClick} />);

        expect(screen.getByTestId('qr-code-dialog')).toHaveAttribute('open');
      });
    });
  });
});
