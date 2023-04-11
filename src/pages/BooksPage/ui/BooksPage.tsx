import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {Wrapper as RecommendedBooks} from './RecommendedBooks/RecommendedBooks';
import {Wrapper as Books} from './Books/Books';
import booksStore from '../model/store/BooksStore';

const BooksPage = () => {
  useEffect(() => {
    booksStore.getBooks();

    return () => {
      booksStore.clearBooksInfo();
    };
  }, []);

  if (!booksStore.booksSize) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View style={styles.booksPage}>
      <RecommendedBooks />
      <View style={styles.booksWrapper}>
        <Books />
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(BooksPage));

const styles = StyleSheet.create({
  booksPage: {
    flex: 1,
  },
  booksWrapper: {
    marginTop: 30,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
