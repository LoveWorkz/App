import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
// import {
//   endConnection,
//   PurchaseError,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
//   SubscriptionPurchase,
//   ProductPurchase,
// } from 'react-native-iap';
import {observer} from 'mobx-react-lite';

import {
  shopTopBackground,
  shopTopBackgroundDark,
} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  SubscriptionBlock,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
// import {isPlatformIos} from '@src/shared/consts/common';
// import inAppPurchaseStore from '../model/store/InAppPurchaseStore';
// import {SubscriptionsIds} from '../model/types/inAppPurchaseType';

// const subscriptionsIds = Platform.select({
//   ios: [],
//   android: [SubscriptionsIds.YEARYL, SubscriptionsIds.MONTHLY],
// });

// let purchaseUpdateSubscription: any;
// let purchaseErrorSubscription: any;

const InAppPurchase = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;
  // const subscriptions = inAppPurchaseStore.subscriptions;
  // const {yearly, monthly} =
  //   inAppPurchaseStore.getYearlyAndMonthlySubscriptions(subscriptions);

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.MONTHLY,
  );

  // useEffect(() => {
  //   inAppPurchaseStore.init(subscriptionsIds as string[]);

  //   purchaseUpdateSubscription = purchaseUpdatedListener(
  //     (purchase: SubscriptionPurchase | ProductPurchase) => {
  //       console.log('purchaseUpdatedListener', purchase);

  //       const receipt = purchase.transactionReceipt;
  //       if (receipt) {
  //         console.log(receipt);
  //       }
  //     },
  //   );

  //   purchaseErrorSubscription = purchaseErrorListener(
  //     (error: PurchaseError) => {
  //       console.warn('purchaseErrorListener', error);
  //     },
  //   );

  //   return () => {
  //     if (purchaseUpdateSubscription) {
  //       purchaseUpdateSubscription.remove();
  //       purchaseUpdateSubscription = null;
  //     }

  //     if (purchaseErrorSubscription) {
  //       purchaseErrorSubscription.remove();
  //       purchaseErrorSubscription = null;
  //     }

  //     endConnection();
  //   };
  // }, []);

  // if (!(yearly && monthly)) {
  //   return <></>;
  // }

  const onPressHandler = () => {
    // if (isPlatformIos) {
    //   return;
    // }
    // let productId = yearly.productId;
    // let offerToken = yearly.subscriptionOfferDetails?.[0]?.offerToken;
    // const isMonthly = subscriptionType === SubscriptionType.MONTHLY;
    // if (isMonthly) {
    //   productId = monthly.productId;
    //   offerToken = monthly.subscriptionOfferDetails?.[0]?.offerToken;
    // }
    // if (productId && offerToken) {
    //   inAppPurchaseStore.subscribe({productId, offerToken});
    // }
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
        <Button
          onPress={onPressHandler}
          style={styles.btn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
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
});
