import React, {memo} from 'react';
import {Pressable} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Favorite, favoriteStore} from '@src/entities/Favorite';
import {DocumentType} from '@src/shared/types/types';
import {questionFavourites} from '@src/shared/assets/images';

interface FavouritesProps {
  isLoading: boolean;
}

export const Favourites = (props: FavouritesProps) => {
  const {isLoading} = props;
  const {t} = useTranslation();

  if (isLoading) {
    return <Favorite image={questionFavourites} text={''} isLoading={true} />;
  }

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.FAVORITE,
    });
  };

  const favorite = favoriteStore.questionFavorites;
  if (!favorite) {
    return null;
  }

  return (
    <Pressable onPress={onPressHandler}>
      <Favorite
        image={questionFavourites}
        text={`${favorite.ids.length} ${t('questions.questions')}`}
        isLoading={isLoading}
      />
    </Pressable>
  );
};

export default memo(observer(Favourites));
