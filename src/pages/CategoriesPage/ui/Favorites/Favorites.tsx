import React, {memo} from 'react';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Favorite, favoriteStore} from '@src/entities/Favorite';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import categoriesStore from '../../model/store/categoriesStore';

const FavoriteSessions = () => {
  const {t} = useTranslation();

  const isLoading = categoriesStore.isCategoriesPageLoading;

  if (isLoading) {
    return <Favorite text={''} isLoading={true} />;
  }

  const favorite = favoriteStore.sessiionFavorites;
  if (!(favorite && favorite.ids.length)) {
    return null;
  }

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.FAVORITE_SESSIONS);
  };

  const isLengthOne = favorite.ids.length === 1;

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite
        text={`${favorite.ids.length} ${
          isLengthOne ? t('sessions.session') : t('sessions.sessions')
        }`}
        isLoading={isLoading}
      />
    </Pressable>
  );
};

export default memo(observer(FavoriteSessions));
