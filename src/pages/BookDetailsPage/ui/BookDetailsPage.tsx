import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Book} from '@src/entities/Book';
import {verticalScale} from '@src/shared/lib/Metrics';
import bookDetailsStore from '../model/store/BookDetailsStore';

interface BookDetailsPageProps {
  route?: {params: {id: string}};
}

export const BookDetailsPage = (props: BookDetailsPageProps) => {
  const {route} = props;
  const currentBook = bookDetailsStore.currentBook;
  const isLoading = bookDetailsStore.isBookDetailsPageLoading;

  useEffect(() => {
    if (route?.params && route.params.id) {
      bookDetailsStore.init(route.params.id);
    }
  }, [route]);

  return (
    <View style={styles.BookDetailsPage}>
      {currentBook && <Book isLoading={isLoading} bookInfo={currentBook} />}
    </View>
  );
};

export const Wrapper = memo(observer(BookDetailsPage));

const styles = StyleSheet.create({
  BookDetailsPage: {
    flex: 1,
    marginTop: verticalScale(10),
  },
});
