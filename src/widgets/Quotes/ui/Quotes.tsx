import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import QuotesModal from './QuotesModal';
import quotesStore from '../model/store/QuotesStore';

const Quotes = () => {
  // useEffect(() => {
  //   quotesStore.setIsQuoteModalVisible(true);
  // }, []);

  return (
    <View>
      <QuotesModal
        visible={quotesStore.isQuoteModalVisible}
        // visible={true}
        setVisible={quotesStore.setIsQuoteModalVisible}
      />
    </View>
  );
};

export default memo(observer(Quotes));
