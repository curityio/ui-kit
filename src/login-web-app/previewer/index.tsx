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
import { required } from '../src/shared/util/type-utils';
import { Previewer } from './Previewer';
import '@css/styles.css';
import './shared/styles/previewer.css';

createRoot(required(document.getElementById('root'))).render(
  <StrictMode>
    <Previewer />
  </StrictMode>
);
