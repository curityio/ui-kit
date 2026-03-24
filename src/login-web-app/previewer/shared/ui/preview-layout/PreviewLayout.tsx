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
import styles from './preview-layout.module.css';

interface PreviewLayoutProps {
  children: ReactNode;
}

export function PreviewLayout({ children }: PreviewLayoutProps) {
  return <section className={styles.sectionLightGradient}>{children}</section>;
}
