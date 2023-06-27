import React, {memo} from 'react';
import {Pressable} from 'react-native';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Favorite} from '@src/entities/Favorite';
import {DocumentType} from '@src/shared/types/types';

interface FavouritesProps {
  isLoading: boolean;
}

export const Favourites = (props: FavouritesProps) => {
  const {isLoading} = props;

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.FAVORITE,
    });
  };

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite isLoading={isLoading} />
    </Pressable>
  );
};

export default memo(Favourites);
