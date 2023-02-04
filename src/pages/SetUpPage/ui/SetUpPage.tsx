import React, {memo} from 'react';

import {Profile} from '@src/entities/Profile';

const SetUpPage = () => {
  return <Profile isSetUp={true} />;
};

export const Wrapper = memo(SetUpPage);
