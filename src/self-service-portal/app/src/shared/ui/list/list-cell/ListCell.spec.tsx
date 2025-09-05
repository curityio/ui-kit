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
import { ListCell } from '../../index.ts';

describe('ListCell Component', () => {
  it('should render the list cell with the provided class name', () => {
    render(<ListCell className="custom-cell">Cell Content</ListCell>);

    const cell = screen.getByText('Cell Content');

    expect(cell).toBeDefined();
    expect(cell.getAttribute('class')).toContain('custom-cell');
  });
});
