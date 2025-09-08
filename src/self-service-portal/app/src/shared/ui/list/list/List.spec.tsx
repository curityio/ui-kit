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
import { describe, it, expect } from 'vitest';
import { List } from './List.tsx';
describe('List Component', () => {
  describe('Rendering', () => {
    const mockItems = ['Item 1', 'Item 2', 'Item 3'];

    beforeEach(() => {
      render(
        <List className="custom-list m13 mt0">
          {mockItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </List>
      );
    });

    it('should render list rows with the provided className', () => {
      const list = screen.getByRole('list');

      expect(list).not.toBeNull();
      expect(screen.getByText('Item 1')).not.toBeNull();
      expect(list.getAttribute('class')).toContain('custom-list m13 mt0');
    });

    it('should render the correct number of list rows', () => {
      const listRows = screen.getAllByRole('listitem');

      expect(listRows.length).toBe(mockItems.length);
      expect(screen.getByText('Item 1')).not.toBeNull();
      expect(screen.getByText('Item 2')).not.toBeNull();
      expect(screen.getByText('Item 3')).not.toBeNull();
    });
  });

  describe('Custom properties', () => {
    it('should apply custom properties when provided, to the list', () => {
      render(
        <List className="dynamic-props-list" id="test-list">
          <li>Item 1</li>
        </List>
      );

      const list = screen.getByRole('list');

      expect(list).not.toBeNull();
      expect(list.getAttribute('id')).toBe('test-list');
    });
  });
});
