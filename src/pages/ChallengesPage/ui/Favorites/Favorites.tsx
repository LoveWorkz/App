import React, {memo} from 'react';
import {Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Favorite, favoriteStore} from '@src/entities/Favorite';
import {challengeFavourites} from '@src/shared/assets/images';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import challengesStore from '../../model/store/challengesStore';

const Favorites = () => {
  const {t} = useTranslation();

  const isLoading = challengesStore.isChallengePageLoading;
  const favorite = favoriteStore.favorites;
  if (!favorite) {
    return null;
  }

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.FAVORITES_CHALLENGES);
  };

  return (
    <Pressable onPress={onPressHandler}>
      {!!favorite.ids.length && (
        <Favorite
          isChallenge
          image={challengeFavourites}
          text={`${favorite.ids.length} ${t('challenge.title')}`}
          isLoading={isLoading}
        />
      )}
    </Pressable>
  );
};

export default memo(observer(Favorites));
