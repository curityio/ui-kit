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

import { ReactNode } from 'react';

interface WellProps {
  children: ReactNode;
}

/**
 * @description
 * # WELL COMPONENT
 *
 * A styled container component with centered layout and background.
 *
 * @param children - Content to display within the well
 *
 * @example
 * ```tsx
 * <Well>
 *   <h1>Welcome</h1>
 * </Well>
 * ```
 */

export function Well({ children }: WellProps) {
  return <div className="haapi-stepper-well">{children}</div>;
}
