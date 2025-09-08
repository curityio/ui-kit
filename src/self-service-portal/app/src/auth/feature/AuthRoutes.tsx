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

import { useLocation, Navigate, Outlet } from 'react-router';
import { useAuth } from '../data-access/AuthProvider.tsx';

export interface AuthRoutesProps {
  children?: React.ReactNode;
}

export const AuthRoutes = ({ children }: AuthRoutesProps) => {
  const { session } = useAuth();
  const location = useLocation();
  const elementsToRender = children ? children : <Outlet />;

  return session?.isLoggedIn ? elementsToRender : <Navigate to="login" state={{ from: location }} replace />;
};
