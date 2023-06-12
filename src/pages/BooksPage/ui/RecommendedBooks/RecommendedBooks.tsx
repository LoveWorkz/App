import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {BookPreview} from '@src/entities/BookPreview';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {BookType} from '@src/entities/Book';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {verticalScale} from '@src/shared/lib/Metrics';
import BooksStore from '../../model/store/BooksStore';

const RecommendedBooks = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const recommendedBooksList = BooksStore.recommendedBooksList;

  const onBookPreviewPressHandler = (id: string) => {
    // unfocus search input
    Keyboard.dismiss();
    navigation.navigate(AppRouteNames.BOOK_DETAILS, {id});
  };

  return (
    <View>
      <AppText
        style={[styles.recommended, {color: colors.primaryTextColor}]}
        text={t('books.recommended')}
        weight={'500'}
        size={TextSize.LEVEL_5}
      />
      {!!recommendedBooksList.length && (
        <CarouselSquare
          withPagination
          isLandscape={false}
          carouselHeight={240}
          Component={(props: BookType) => (
            <Pressable onPress={() => onBookPreviewPressHandler(props.id)}>
              <BookPreview {...props} />
            </Pressable>
          )}
          data={recommendedBooksList}
        />
      )}
    </View>
  );
};

export const Wrapper = memo(observer(RecommendedBooks));

const styles = StyleSheet.create({
  recommended: {
    marginBottom: verticalScale(-10),
  },
});
