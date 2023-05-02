import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {BookType} from '@src/entities/Book';
import QuotesModal from './QuotesModal';
import quotesStore from '../model/store/QuotesStore';

interface QuotesProps {
  books: BookType[];
}

const Quotes = (props: QuotesProps) => {
  const {books} = props;

  useEffect(() => {
    quotesStore.checkQuotesShownStatus(books);
  }, [books]);

  return (
    <View style={styles.Quotes}>
      <QuotesModal
        visible={quotesStore.isQuoteModalVisible}
        setVisible={quotesStore.setIsQuoteModalVisible}
      />
    </View>
  );
};

export default memo(observer(Quotes));

const styles = StyleSheet.create({
  Quotes: {},
});
