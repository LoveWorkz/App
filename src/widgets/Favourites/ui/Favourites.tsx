import React, {memo} from 'react';
import {Pressable} from 'react-native';
import {observer} from 'mobx-react-lite';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Favorite, favoriteStore} from '@src/entities/Favorite';

export const Favourites = () => {
  const favorites = favoriteStore.favorite;

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: 'favorite',
    });
  };

  if (!(favorites && favorites.questions.length)) {
    return null;
  }

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite />
    </Pressable>
  );
};

export default memo(observer(Favourites));
