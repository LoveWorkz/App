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
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import booksStore from '../../model/store/BooksStore';
import {Wrapper as BookItem} from '../BookItem/BookItem';
import BooksSearchBar from '../BooksSearchBar/BooksSearchBar';

const FilterItem = memo(({name, active}: {name: string; active: boolean}) => {
  const onFiltreHandler = useCallback((key: string) => {
    booksStore.filterBooks(key);
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.rubricCategory}>
      {name && (
        <RubricFilterItem
          action
          onPress={onFiltreHandler}
          active={active}
          rubric={name}
          text={name}
        />
      )}
    </View>
  );
});

const Books = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const booksList = booksStore.booksFilteredList;
  const booksCategories = rubricFilterItemStore.rubricFilterItems;

  // adding an empty object for a space at the beginning
  const booksCategoriesWithSpace = useMemo(() => {
    return [{}, ...booksCategories];
  }, [booksCategories]);

  return (
    <View>
      <AppText
        style={[styles.booksTitle, {color: colors.primaryTextColor}]}
        text={t('books.books')}
        weight={'500'}
        size={TextSize.LEVEL_5}
      />
      <BooksSearchBar />
      <View style={styles.booksCategories}>
        <HorizontalCarousel
          data={booksCategoriesWithSpace}
          Component={FilterItem}
        />
      </View>
      <View style={styles.books}>
        {booksList.length ? (
          booksList.map(book => {
            return (
              <View style={styles.book} key={book.id}>
                <BookItem
                  id={book.id}
                  image={book.image.front}
                  title={book.name}
                  description={book.description}
                />
              </View>
            );
          })
        ) : (
          <View style={styles.noResults}>
            <AppText
              style={[styles.booksTitle, {color: colors.primaryTextColor}]}
              text={t('noResults')}
              size={TextSize.LEVEL_7}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export const Wrapper = memo(observer(Books));

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
});
