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

import { setupWorker } from 'msw/browser'
import { common } from './common.ts'
import { um } from './um.ts'
import { ga } from './ga.ts'

export const mockWorker = setupWorker(...common, ...um, ...ga)