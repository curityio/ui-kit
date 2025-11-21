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
import { App } from '../src/App';
import { mockWorker } from './mocks/browser';

import '@curity-ui-kit/css/lib/dist/index.css';
import '../src/styles/index.css';
import '../src/styles/app-layout.css';

mockWorker.start().then(() => {
    createRoot(document.getElementById('root')!).render(
            <StrictMode>
                <App/>
            </StrictMode>
    );
});