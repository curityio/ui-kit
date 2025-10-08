/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListRow } from './ListRow';
import * as UiConfigProviderAll from '@/ui-config/data-access/UiConfigProvider';
import { UI_CONFIG } from '@/ui-config/utils/ui-config-fixture';
import { expectAsyncElementNotToBeFound } from '@/shared/utils/test';

const mockOnDelete = vi.fn();

const defaultProps = {
  item: {
    name: 'Opt-in Multi Factor Authentication',
    message: 'Enabled since Nov 5, 2021',
    link: '/opt-in-test-link',
  },
  itemLinkButtonLabel: 'View Details',
  renderIcon: <span>Test Icon</span>,
  onItemDelete: mockOnDelete,
  showDelete: true,
};

vi.mock('react-router', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="mock-link">
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="mock-outlet" />,
}));

describe('ListRow Component', () => {
  beforeAll(() => {
    vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue(UI_CONFIG);
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => {
          if (key === 'delete-row') {
            return 'delete row';
          }
          return key;
        },
        i18n: { language: 'en' },
        ready: true,
      }),
    }));
  });

  describe('Rendering', () => {
    it('should render the list row', async () => {
      render(<ListRow {...defaultProps} />);

      const listItem = await screen.findByRole('listitem');

      expect(listItem).not.toBeNull();
    });

    it('should render children content if provided', () => {
      render(
        <ListRow {...defaultProps}>
          <div>Children Content</div>
        </ListRow>
      );

      const childContent = screen.getByText('Children Content');

      expect(childContent).not.toBeNull();
    });

    it('should fallback to default rendering if children are not provided', async () => {
      render(<ListRow {...defaultProps} />);

      const itemName = await screen.findByText('Opt-in Multi Factor Authentication');
      const itemMessage = await screen.findByText('Enabled since Nov 5, 2021');

      expect(itemName).not.toBeNull();
      expect(itemMessage).not.toBeNull();
    });
  });

  describe('Custom properties', () => {
    it('should apply custom properties when provided, to the list row', async () => {
      render(<ListRow {...defaultProps} id="test-list-row" className="test-class" />);

      const listItem = await screen.findByRole('listitem');

      expect(listItem).not.toBeNull();
      expect(listItem.getAttribute('id')).toBe('test-list-row');
    });
  });

  describe('Default rendering', () => {
    describe('Actions', () => {
      describe('Delete', () => {
        it('should display the delete button when enabled from config', async () => {
          render(<ListRow {...defaultProps} showDelete={true} />);

          const deleteButton = await screen.findByRole('button', { name: /delete row/i });

          expect(deleteButton).not.toBeNull();
        });

        it('should trigger the delete callback with the correct item when the delete button is clicked', async () => {
          render(<ListRow {...defaultProps} showDelete={true} />);

          const deleteButton = await screen.findByRole('button', { name: /delete row/i });
          deleteButton.click();

          expect(mockOnDelete).toHaveBeenCalledTimes(1);
          expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.item);
        });

        it('should not display the delete button when not enabled from config', async () => {
          render(<ListRow {...defaultProps} showDelete={false} />);

          await expectAsyncElementNotToBeFound(screen.findByRole('button', { name: /delete row/i }));
        });
      });
    });

    describe('Link', () => {
      it('should display the link with the correct attributes if the link is provided', async () => {
        render(<ListRow {...defaultProps} />);

        const link = await screen.findByRole('link', { name: /view details/i });

        expect(link).not.toBeNull();
        expect(link.getAttribute('href')).toBe(defaultProps.item.link);
      });

      it('should not display the link if no link is provided', async () => {
        render(<ListRow {...defaultProps} item={{ ...defaultProps.item, link: null }} />);

        const link = await screen.queryByRole('link', { name: /view details/i });

        expect(link).toBeNull();
      });
    });
  });
});
