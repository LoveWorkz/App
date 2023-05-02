import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Book} from '@src/entities/Book';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
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

  return (
    <LoaderWrapper isLoading={bookDetailsStore.isBookDetailsPageLoading}>
      <View style={styles.BookDetailsPage}>
        {currentBook && <Book bookInfo={currentBook} />}
      </View>
    </LoaderWrapper>
  );
};

export const Wrapper = memo(observer(BookDetailsPage));

const styles = StyleSheet.create({
  BookDetailsPage: {
    flex: 1,
  },
});
