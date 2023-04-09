import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {BookCategory} from '@src/entities/BookCategory';
import booksStore from '../../model/store/BooksStore';
import {Wrapper as BookItem} from '../BookItem/BookItem';

const Books = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const booksList = booksStore.booksFilteredList;

  const onFiltreHandler = (key: string) => {
    booksStore.filterBooks(key);
  };

  return (
    <View>
      <AppText
        style={[styles.booksTitle, {color: colors.primaryTextColor}]}
        text={t('books.books')}
        weight={'500'}
        size={TextSize.LEVEL_5}
      />
      <View style={styles.booksCategories}>
        <BookCategory
          action={true}
          category={'Bestseller'}
          onPress={onFiltreHandler}
          text={t('books.bestseller')}
        />
        <BookCategory
          action={true}
          category={'Romance'}
          onPress={onFiltreHandler}
          text={t('books.romance')}
        />
        <BookCategory
          action={true}
          category={'Conflict'}
          onPress={onFiltreHandler}
          text={t('books.conflict')}
        />
      </View>
      <View style={styles.books}>
        {!!booksList.length &&
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
          })}
      </View>
    </View>
  );
};

export const Wrapper = memo(observer(Books));

const styles = StyleSheet.create({
  booksTitle: {
    marginBottom: 20,
  },
  books: {
    marginTop: 20,
  },
  book: {
    marginBottom: 20,
  },
  booksCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
