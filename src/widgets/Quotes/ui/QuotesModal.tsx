import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {HeartsIcon} from '@src/shared/assets/icons/Hearts';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import quotesStore from '../model/store/QuotesStore';
import {useTheme} from '@src/app/providers/themeProvider';

interface QuotesModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const QuotesModal = (props: QuotesModalProps) => {
  const {visible, setVisible} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();
  const {quote, bookId, bookAuthor, bookName} = quotesStore.quotesModalInfo;

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const onDontShowAgainHandler = () => {
    quotesStore.toggleQuote(false);
    quotesStore.setIsQuoteModalVisible(false);
  };

  const onShowBookPressHanlder = () => {
    quotesStore.setIsQuoteModalVisible(false);
    navigation.navigate(AppRouteNames.BOOK_DETAILS, {id: bookId});
  };

  return (
    <Modal
      isCloseIcon
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('quotes.quote_of_the_day')}
      />
      <SvgXml xml={HeartsIcon} style={styles.icon} />

      <AppText
        style={[styles.QuoteText, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_5}
        weight={'500'}
        text={`"${quote}"`}
      />
      <View style={styles.bookInfoGroup}>
        <GradientText
          size={TextSize.LEVEL_5}
          weight={'600'}
          text={`${bookAuthor},`}
        />
        <GradientText size={TextSize.LEVEL_5} weight={'600'} text={bookName} />
      </View>

      <Button
        theme={ButtonTheme.GRADIENT}
        style={styles.btn}
        onPress={onShowBookPressHanlder}>
        <AppText
          style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
          size={TextSize.LEVEL_4}
          text={t('quotes.show_me_book')}
        />
      </Button>
      <Button theme={ButtonTheme.CLEAR} onPress={onDontShowAgainHandler}>
        <AppText
          style={[styles.dontShowAgain, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={t('common.dont_show_again')}
        />
      </Button>
    </Modal>
  );
};

export default memo(observer(QuotesModal));

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(395),
  },
  icon: {
    height: verticalScale(23),
    width: horizontalScale(55),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  QuoteText: {
    textAlign: 'center',
  },
  bookInfoGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  btn: {
    width: '100%',
  },
  dontShowAgain: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
  },
});
