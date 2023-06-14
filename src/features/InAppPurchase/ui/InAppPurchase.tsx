import React, {memo, useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {
  initConnection,
  endConnection,
  getProducts,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  ProductPurchase,
  // getSubscriptions,
  // requestSubscription,
} from 'react-native-iap';

import {
  shopTopBackground,
  shopTopBackgroundDark,
} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  SubscriptionBlock,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

const items = Platform.select({
  ios: [],
  android: ['rniap_1_49_1m'],
});

let purchaseUpdateSubscription: any;
let purchaseErrorSubscription: any;

const InAppPurchase = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;
  const [products, setProducts] = useState<any[]>([]);

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.MONTHLY,
  );

  useEffect(() => {
    if (__DEV__) {
      return;
    }

    const init = async () => {
      await initConnection();
      const res = await getProducts({skus: items as string[]});
      // const subscriptions = await getSubscriptions({skus: items as string[]});
      setProducts(res);
      // Alert.alert(JSON.stringify(subscriptions));
      Alert.alert(JSON.stringify(res));

      purchaseUpdateSubscription = purchaseUpdatedListener(
        (purchase: SubscriptionPurchase | ProductPurchase) => {
          Alert.alert('purchases', JSON.stringify(purchase));
          console.log('purchaseUpdatedListener', purchase);
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            console.log(receipt);
          }
        },
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.warn('purchaseErrorListener', error);
        },
      );
    };

    init();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }

      endConnection();
    };
  }, []);

  // const subscribe = async (sku: string, offerToken: string) => {
  //   try {
  //     if (offerToken) {
  //       await requestSubscription(
  //         {sku},
  //         //@ts-ignore
  //         ...{subscriptionOffers: [{sku, offerToken}]},
  //       );
  //     } else {
  //       await requestSubscription({sku});
  //     }
  //   } catch (err: any) {
  //     console.warn(err.code, err.message);
  //   }
  // };

  if (products.length) {
    return <Text>{JSON.stringify(products[0])}</Text>;
  }

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
      <View style={[styles.subscriptionBlocks]}>
        <SubscriptionBlock
          subscriptionType={SubscriptionType.MONTHLY}
          chosenSubscriptionType={subscriptionType}
          setSubscriptionType={setSubscriptionType}
        />
        <SubscriptionBlock
          subscriptionType={SubscriptionType.YEARLY}
          chosenSubscriptionType={subscriptionType}
          setSubscriptionType={setSubscriptionType}
        />
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
    height: '100%',
    justifyContent: 'space-around',
  },
  image: {
    height: verticalScale(180),
    width: windowWidth,
    marginLeft: -globalPadding,
  },
  textWrapper: {
    marginBottom: verticalScale(50),
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
});
