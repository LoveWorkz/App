import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Book} from '@src/entities/Book';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import bookDetailsStore from '../model/store/BookDetailsStore';

interface BookDetailsPageProps {
  route?: {params: {id: string}};
}

export const BookDetailsPage = (props: BookDetailsPageProps) => {
  const {route} = props;
  const currentBook = bookDetailsStore.currentBook;

  useEffect(() => {
    if (route?.params && route.params.id) {
      bookDetailsStore.getCurrentBook(route.params.id);
    }
  }, [route]);

  if (!currentBook) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View style={styles.BookDetailsPage}>
      <Book bookInfo={currentBook} />
    </View>
  );
};

export const Wrapper = memo(observer(BookDetailsPage));

const styles = StyleSheet.create({
  BookDetailsPage: {
    flex: 1,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
