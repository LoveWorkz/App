import React, {memo} from 'react';
import {View} from 'react-native';

import {Profile} from '@src/entities/Profile';

const SetUpPage = () => {
  return (
    <View>
      <Profile isSetUp={true} />
    </View>
  );
};

export const Wrapper = memo(SetUpPage);
