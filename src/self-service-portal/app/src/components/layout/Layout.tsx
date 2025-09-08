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

import { Header } from '../../shared/ui/header/Header.tsx';
import { Sidebar } from './sidebar/Sidebar.tsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={`app-container ${isSidebarOpen && 'app-container-sidebar-open'}`}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </>
  );
};
