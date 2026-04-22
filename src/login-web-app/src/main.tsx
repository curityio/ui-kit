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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { required } from './shared/util/type-utils';

import '@css/styles.css';

createRoot(required(document.getElementById('root'))).render(
  <StrictMode>
    <App />
  </StrictMode>
);
