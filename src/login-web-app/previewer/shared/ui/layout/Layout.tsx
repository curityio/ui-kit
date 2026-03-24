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
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';
import classes from './layout.module.css';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Layout = ({ children, onNavigate, currentPage }: LayoutProps) => {
  return (
    <>
      <Header />
      <div className={classes.layout}>
        <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
        <main className={classes.mainContent} id="main-content" role="main" aria-label="Main content">
          {children}
        </main>
      </div>
    </>
  );
};
