import React, {memo} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import quotesStore from '../model/store/QuotesStore';

interface QuotesSwitcherProps {}

const QuotesSwitcher = (props: QuotesSwitcherProps) => {
  const {} = props;
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <View style={styles.QuotesSwitcher}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_5}
        text={t('quotes.quote_of_the_day')}
      />
      <Switch
        style={styles.switcher}
        trackColor={{false: '#767577', true: '#ECB7FF'}}
        thumbColor={'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={quotesStore.toggleQuote}
        value={quotesStore.quoteInfo.isQuoteVisible}
      />
    </View>
  );
};

export default memo(observer(QuotesSwitcher));

const styles = StyleSheet.create({
  QuotesSwitcher: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  switcher: {
    transform: [
      {scaleX: isPlatformIos ? 0.8 : 1.2},
      {scaleY: isPlatformIos ? 0.8 : 1.2},
    ],
  },
});
