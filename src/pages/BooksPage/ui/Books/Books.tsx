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
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import booksStore from '../../model/store/BooksStore';
import {Wrapper as BookItem} from '../BookItem/BookItem';
import BooksSearchBar from '../BooksSearchBar/BooksSearchBar';

const FilterItem = memo(({name, active}: {name: string; active: boolean}) => {
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

const Books = () => {
  const {t} = useTranslation();
  const {i18n} = useTranslation();
  const colors = useColors();
  const booksList = booksStore.booksFilteredList;
  const booksCategories = rubricFilterItemStore.rubricFilterItems;

  const language = i18n.language as LanguageValueType;

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
                  title={book.displayName[language]}
                  description={book.description[language]}
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
});
