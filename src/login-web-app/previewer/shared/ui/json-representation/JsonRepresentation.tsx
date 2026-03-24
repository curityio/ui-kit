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

import JsonPrettify from '../../../../src/shared/ui/devbar/PrettyPrint';
import { JsonValue } from '../../../../src/shared/ui/devbar/types';

interface JsonRepresentationProps {
  data: unknown;
}

export function JsonRepresentation({ data }: JsonRepresentationProps) {
  return (
    <div>
      <JsonPrettify data={data as JsonValue} />
    </div>
  );
}
