import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {
  shopTopBackground,
  shopTopBackgroundDark,
} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {SubscriptionBlock} from '@src/entities/SubscriptionBlock';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

interface InAppPurchaseProps {}

const InAppPurchase = (props: InAppPurchaseProps) => {
  const {} = props;
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;

  return (
    <View style={styles.InAppPurchase}>
      <FastImage
        style={styles.image}
        source={isDark ? shopTopBackgroundDark : shopTopBackground}
      />
      <View style={styles.textWrapper}>
        <AppText
          style={styles.title}
          size={TextSize.LEVEL_5}
          weight={'500'}
          text={'Get access to all categories and challenges'}
        />

        <AppText
          style={styles.text}
          text={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet'
          }
        />
      </View>
      <View style={styles.subscriptionBlocks}>
        <SubscriptionBlock isActive />
        <SubscriptionBlock isYearly />
      </View>
      <Button style={styles.btn} theme={ButtonTheme.GRADIENT}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={t('buy_now')}
        />
      </Button>
    </View>
  );
};

export default memo(InAppPurchase);

const styles = StyleSheet.create({
  InAppPurchase: {
    width: '100%',
    zIndex: 1,
  },
  image: {
    height: verticalScale(180),
    width: windowWidth,
    marginLeft: -globalPadding,
  },
  textWrapper: {
    marginBottom: verticalScale(50),
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  subscriptionBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 1,
  },
  btn: {
    marginTop: verticalScale(30),
  },
});
