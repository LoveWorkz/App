import React, {memo} from 'react';
import {Pressable} from 'react-native';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Favorite} from '@src/entities/Favorite';

export const Favourites = () => {
  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: 'favorite',
    });
  };

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite />
    </Pressable>
  );
};

export default memo(Favourites);
