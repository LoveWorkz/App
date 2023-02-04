import React, {memo} from 'react';

import {Profile} from '@src/entities/Profile';

const ProfilePage = () => {
  return <Profile />;
};

export const Wrapper = memo(ProfilePage);
