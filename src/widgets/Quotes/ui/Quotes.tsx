import React, {memo} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import QuotesModal from './QuotesModal';
import quotesStore from '../model/store/QuotesStore';

const Quotes = () => {
  return (
    <View>
      <QuotesModal
        visible={quotesStore.isQuoteModalVisible}
        setVisible={quotesStore.setIsQuoteModalVisible}
      />
    </View>
  );
};

export default memo(observer(Quotes));
