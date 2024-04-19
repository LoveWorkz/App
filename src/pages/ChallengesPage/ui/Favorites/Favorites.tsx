import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Favorite, favoriteStore} from '@src/entities/Favorite';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {verticalScale} from '@src/shared/lib/Metrics';
import {questionFavourites} from '@src/shared/assets/images';
import challengesStore from '../../model/store/challengesStore';

const Favorites = () => {
  const {t} = useTranslation();

  const isLoading = challengesStore.isChallengePageLoading;
  const favorite = favoriteStore.favorites;

  if (isLoading) {
    return <View style={styles.favorites}>
        <Favorite image={questionFavourites} text={''} isLoading={true} />
      </View>
  }

  if (!favorite) {
    return null;
  }

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.FAVORITES_CHALLENGES);
  };

  if (!favorite.ids.length) {
    return null;
  }

  return (
    <Pressable onPress={onPressHandler}>
      <View style={styles.favorites}>
        <Favorite
          image={questionFavourites}
          text={`${favorite.ids.length} ${t('challenge.title')}`}
          isLoading={isLoading}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  favorites: {
    marginBottom: verticalScale(15),
  },
});

export default memo(observer(Favorites));
