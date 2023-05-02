import React, {memo, useCallback, useEffect} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Wrapper as RecommendedBooks} from './RecommendedBooks/RecommendedBooks';
import {Wrapper as Books} from './Books/Books';
import booksStore from '../model/store/BooksStore';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';

const BooksPage = () => {
  useEffect(() => {
    booksStore.init();

    return () => {
      booksStore.clearBooksInfo();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // unfocus search input
      return () => Keyboard.dismiss();
    }, []),
  );

  const onBookPagePressHandler = () => {
    // unfocus search input
    Keyboard.dismiss();
  };

  return (
    <LoaderWrapper isLoading={booksStore.isBooksPageLoading}>
      <Pressable onPress={onBookPagePressHandler} style={styles.booksPage}>
        <RecommendedBooks />
        <View style={styles.booksWrapper}>
          <Books />
        </View>
      </Pressable>
    </LoaderWrapper>
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
});
