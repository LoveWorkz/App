import React, {memo} from 'react';
import {Pressable} from 'react-native';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Favorite} from '@src/entities/Favorite';
import {DocumentType} from '@src/shared/types/types';

export const Favourites = () => {
  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.FAVORITE,
    });
  };

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite />
    </Pressable>
  );
};

export default memo(Favourites);
