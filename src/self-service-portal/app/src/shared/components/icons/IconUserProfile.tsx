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

import { getProfileImageColor, getUserInitial } from '../../../util.ts';

interface IconUserProfileProps {
  name: string;
  size?: string;
}

export const IconUserProfile = ({ name, size = '6' }: IconUserProfileProps) => {
  return (
    <div className="flex flex-center flex-gap-2">
      <div
        className={`flex flex-center justify-center white w-${size} h-${size} circle`}
        style={{ backgroundColor: getProfileImageColor(getUserInitial(name)), fontSize: `calc(${size} * 0.5rem)` }}
      >
        {getUserInitial(name)}
      </div>
    </div>
  );
};
