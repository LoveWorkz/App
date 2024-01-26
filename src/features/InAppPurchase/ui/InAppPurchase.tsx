import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import {
  endConnection,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  ProductPurchase,
} from 'react-native-iap';
import { observer } from 'mobx-react-lite';

import {
  shopTopBackground,
  shopTopBackgroundDark,
} from '@src/shared/assets/images';
import { horizontalScale, verticalScale } from '@src/shared/lib/Metrics';
import { globalPadding, windowWidth } from '@src/app/styles/GlobalStyle';
import { AppText, TextSize } from '@src/shared/ui/AppText/AppText';
import {
  SubscriptionBlock,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import { Button, ButtonTheme } from '@src/shared/ui/Button/Button';
import { useColors } from '@src/app/providers/colorsProvider';
import { Theme, useTheme } from '@src/app/providers/themeProvider';
import inAppPurchaseStore from '../model/store/InAppPurchaseStore';
import PromoCode from './PromoCode';

const InAppPurchase = () => {
  const { t } = useTranslation();
  const colors = useColors();
  const { theme } = useTheme();
  const isDark = theme === Theme.Dark;
  const isFetching = inAppPurchaseStore.isFetching;
  const formattedProducts = inAppPurchaseStore.formattedProducts;
  const isPromo = inAppPurchaseStore.isPromo;

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.MONTHLY,
  );

  useEffect(() => {
    // Initialize the in-app purchase store with subscription IDs
    inAppPurchaseStore.init();

    // Listener for purchase updates
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase | ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          console.log('Transaction Receipt:', receipt);
          inAppPurchaseStore.purchaseUpdatedListener(receipt);
        }
      },
    );

    // Listener for purchase errors
    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
      },
    );

    const cleanupListeners = () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };

    return () => {
      cleanupListeners();
      endConnection();
    };
  }, []);

  if (isFetching || !formattedProducts) {
    return <ActivityIndicator />;
  }

  const onPressHandler = () => {
    inAppPurchaseStore.subscribe(subscriptionType);
  };

  return (
    <View style={styles.InAppPurchase}>
      <FastImage
        style={styles.image}
        source={isDark ? shopTopBackgroundDark : shopTopBackground}
        resizeMode={'contain'}
      />
      <View style={styles.content}>
        <View style={styles.textWrapper}>
          <AppText
            style={styles.title}
            size={TextSize.LEVEL_4}
            weight={'500'}
            text={t('shop.header')}
          />

          <AppText
            style={styles.text}
            size={TextSize.LEVEL_3}
            text={t('shop.description')}
          />
        </View>
        <View style={styles.promoCode}>
          <PromoCode />
        </View>
        <View style={[styles.subscriptionBlocks]}>
          {formattedProducts.formattedMonthly && (
            <SubscriptionBlock
              productDetails={
                isPromo
                  ? formattedProducts.formattedMonthlyPromo
                  : formattedProducts.formattedMonthly
              }
              subscriptionType={SubscriptionType.MONTHLY}
              chosenSubscriptionType={subscriptionType}
              setSubscriptionType={setSubscriptionType}
            />
          )}
          {formattedProducts.formattedYearly && (
            <SubscriptionBlock
              productDetails={
                isPromo
                  ? formattedProducts.formattedYearlyPromo
                  : formattedProducts.formattedYearly
              }
              subscriptionType={SubscriptionType.YEARLY}
              chosenSubscriptionType={subscriptionType}
              setSubscriptionType={setSubscriptionType}
            />
          )}
        </View>
        <Button
          onPress={onPressHandler}
          style={styles.btn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{ color: colors.bgQuinaryColor }}
            weight={'700'}
            size={TextSize.LEVEL_3}
            text={t('buy_now')}
          />
        </Button>
      </View>
    </View>
  );
};

export default memo(observer(InAppPurchase));

const styles = StyleSheet.create({
  InAppPurchase: {
    width: '100%',
  },
  content: {
    justifyContent: 'space-around',
    paddingHorizontal: horizontalScale(20),
  },
  image: {
    height: verticalScale(180),
    width: windowWidth,
    marginLeft: -globalPadding,
  },
  textWrapper: {
    marginBottom: verticalScale(70),
    alignItems: 'center',
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
  },
  btn: {
    marginTop: verticalScale(30),
    bottom: verticalScale(5),
  },
  promoCode: {
    marginBottom: 30
  }
});
