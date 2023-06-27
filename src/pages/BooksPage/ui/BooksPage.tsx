import React, {memo, useCallback, useEffect} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {booksFilterItems} from '@src/entities/Book';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Wrapper as RecommendedBooks} from './RecommendedBooks/RecommendedBooks';
import Books from './Books/Books';
import booksStore from '../model/store/BooksStore';

interface BooksPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const BooksPage = (props: BooksPageProps) => {
  const {route} = props;
  const prevRouteName = route?.params?.prevRouteName;
  const isLoading = booksStore.isBooksPageLoading;

  useEffect(() => {
    booksStore.init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        prevRouteName === AppRouteNames.BOOK_DETAILS ||
        prevRouteName === AppRouteNames.SETTINGS
      ) {
        return;
      }

      booksStore.clearBooksInfo();
      rubricFilterItemStore.setRubricFilterItems(booksFilterItems);
    }, [prevRouteName]),
  );

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
    <Pressable onPress={onBookPagePressHandler} style={styles.booksPage}>
      <RecommendedBooks isLoading={isLoading} />
      <View style={styles.booksWrapper}>
        <Books isLoading={isLoading} />
      </View>
    </Pressable>
  );
};

export const ComponentWrapper = memo(observer(BooksPage));

const styles = StyleSheet.create({
  booksPage: {
    flex: 1,
  },
  booksWrapper: {
    marginTop: verticalScale(30),
  },
});
