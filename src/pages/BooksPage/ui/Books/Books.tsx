import React, {memo, useCallback, useMemo} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  RubricFilterItem,
  rubricFilterItemStore,
} from '@src/entities/RubricFilterItem';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {bookExample, BookType} from '@src/entities/Book';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import booksStore from '../../model/store/BooksStore';
import BookItem from '../BookItem/BookItem';
import BooksSearchBar from '../BooksSearchBar/BooksSearchBar';

interface FilterItemProps {
  name: string;
  active: boolean;
  isLoading: boolean;
}

const FilterItem = memo((props: FilterItemProps) => {
  const {name, active, isLoading} = props;

  const {theme} = useTheme();
  const isDarkMode = theme === Theme.Dark;

  const onFiltreHandler = useCallback((key: string) => {
    booksStore.filterBooks(key);
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.rubricCategory}>
      {name && (
        <RubricFilterItem
          isLoading={isLoading}
          isOutline={isDarkMode}
          action
          onPress={onFiltreHandler}
          active={active}
          rubric={name}
          displayName={name}
        />
      )}
    </View>
  );
});

interface BooksProps {
  isLoading: boolean;
}

const Books = (props: BooksProps) => {
  const {isLoading} = props;

  const {t} = useTranslation();
  const {i18n} = useTranslation();
  const colors = useColors();
  let booksList = booksStore.booksFilteredList;
  const booksCategories = rubricFilterItemStore.rubricFilterItems;

  console.log('BOOKS booksList', booksList);

  const language = i18n.language as LanguageValueType;

  const filterItemsWithIsLoading = useMemo(() => {
    return booksCategories.map(booksCategory => ({
      ...booksCategory,
      isLoading: isLoading,
    }));
  }, [isLoading, booksCategories]);

  // adding an empty object for a space at the beginning
  const booksCategoriesWithSpace = useMemo(() => {
    return [{}, ...filterItemsWithIsLoading];
  }, [filterItemsWithIsLoading]);

  if (isLoading) {
    booksList = getEntityExampleDataForSkeleton({
      entity: bookExample,
      count: 3,
    }) as BookType[];
  }

  return (
    <View>
      {isLoading ? (
        <View style={styles.titleSkeleton}>
          <Skeleton height={18} width={70} />
        </View>
      ) : (
        <AppText
          style={[styles.booksTitle, {color: colors.primaryTextColor}]}
          text={t('books.books')}
          weight={'500'}
          size={TextSize.LEVEL_5}
        />
      )}
      <BooksSearchBar isLoading={isLoading} />
      <View style={styles.booksCategories}>
        <HorizontalCarousel
          data={booksCategoriesWithSpace}
          Component={FilterItem}
        />
      </View>
      <View style={styles.books}>
        {booksList.length ? (
          booksList.map(book => {
            // console.log('SINGLE BOOK', book);
            return (
              <View style={styles.book} key={book.id}>
                <BookItem
                  isLoading={isLoading}
                  id={book.id}
                  image={book.image.front}
                  imageName={book.storage?.front_file_name}
                  title={book.displayName?.[language] || ''}
                  description={book.description?.[language] || ''}
                />
              </View>
            );
          })
        ) : (
          <View style={styles.noResults}>
            <AppText
              style={[styles.booksTitle, {color: colors.primaryTextColor}]}
              text={t('common.noResults')}
              size={TextSize.LEVEL_7}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(observer(Books));

const styles = StyleSheet.create({
  booksTitle: {
    marginBottom: verticalScale(20),
  },
  books: {
    marginTop: verticalScale(20),
  },
  book: {
    marginBottom: verticalScale(20),
  },
  booksCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
  },
  noResults: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  rubricCategory: {
    marginLeft: horizontalScale(10),
  },

  titleSkeleton: {
    marginBottom: 20,
  },
});
