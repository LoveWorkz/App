import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {BookPreview} from '@src/entities/BookPreview';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {bookExample, BookType} from '@src/entities/Book';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {verticalScale} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import BooksStore from '../../model/store/BooksStore';

interface RecommendedBooksProps {
  isLoading: boolean;
}

const RecommendedBooks = (props: RecommendedBooksProps) => {
  const {isLoading} = props;

  const {t} = useTranslation();
  const colors = useColors();
  let recommendedBooksList = BooksStore.recommendedBooksList;

  const onBookPreviewPressHandler = (id: string) => {
    if (isLoading) {
      return;
    }

    // unfocus search input
    Keyboard.dismiss();
    navigation.navigate(AppRouteNames.BOOK_DETAILS, {id});
  };

  if (isLoading) {
    recommendedBooksList = getEntityExampleDataForSkeleton({
      entity: bookExample,
      count: 4,
    }) as BookType[];
  }

  return (
    <View>
      {isLoading ? (
        <>
          <View>
            <Skeleton width={200} height={16} />
          </View>
          <View style={styles.paginationSkeleton}>
            <Skeleton width={70} height={16} />
          </View>
        </>
      ) : (
        <AppText
          style={[styles.recommended, {color: colors.primaryTextColor}]}
          text={t('books.recommended')}
          weight={'500'}
          size={TextSize.LEVEL_5}
        />
      )}
      {!!recommendedBooksList.length && (
        <CarouselSquare
          withPagination={false}
          mode={'multiple'}
          withBottomNavigation
          carouselHeight={260}
          paginationStyle={styles.paginationStyle}
          // eslint-disable-next-line react/no-unstable-nested-components
          Component={(param: BookType) => (
            <Pressable onPress={() => onBookPreviewPressHandler(param.id)}>
              <BookPreview isLoading={isLoading} {...param} />
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

  paginationSkeleton: {
    marginTop: verticalScale(20),
    marginBottom: -40,
  },
  paginationStyle: {
    width: '100%',
  },
});
