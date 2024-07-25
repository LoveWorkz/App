import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import {
  endConnection,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  ProductPurchase,
} from 'react-native-iap';
import {observer} from 'mobx-react-lite';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {SubscriptionType} from '@src/entities/SubscriptionBlock';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {windowHeight} from '@src/app/styles/GlobalStyle';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import inAppPurchaseStore from '../model/store/InAppPurchaseStore';
import PromoCode from './PromoCode';
import SubscriptionMethods from './SubscriptionMethods';
import BenefitList from './BenefitList';
import ShopImages from './ShopImages';

interface InAppPurchaseProps {
  onCancelHandler: () => void;
}

const InAppPurchase = (props: InAppPurchaseProps) => {
  const {onCancelHandler} = props;

  const {t} = useTranslation();
  const colors = useColors();
  const isFetching = inAppPurchaseStore.isFetching;
  const formattedProducts = inAppPurchaseStore.formattedProducts;
  const isPromo = inAppPurchaseStore.isPromo;

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.YEARLY,
  );

  useEffect(() => {
    inAppPurchaseStore.init();

    const purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase | ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          inAppPurchaseStore.purchaseUpdatedHandler(receipt);
        }
      },
    );

    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        inAppPurchaseStore.purchaseErrorHandler(error);
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
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const onPressHandler = () => {
    inAppPurchaseStore.subscribe(subscriptionType);
  };

  const onPrivacyPolicyHandler = () => {
    onCancelHandler();
    navigation.navigate(AppRouteNames.PRIVACY_POLICY);
  };

  return (
    <View style={styles.InAppPurchase}>
      <View style={styles.images}>
        <Button onPress={onCancelHandler} style={styles.closeIcon}>
          <SvgXml
            xml={CloseIcon}
            fill={colors.primaryTextColor}
            height={horizontalScale(15)}
            width={horizontalScale(15)}
          />
        </Button>
        <ShopImages />
      </View>

      <AppText
        style={styles.title}
        weight="700"
        size={TextSize.LEVEL_9}
        text={t('common.get_your_own_journey')}
      />

      <View style={styles.benefitList}>
        <BenefitList />
      </View>

      <View style={styles.promoCode}>
        <PromoCode />
      </View>

      <SubscriptionMethods
        subscriptionType={subscriptionType}
        setSubscriptionType={setSubscriptionType}
        formattedProducts={formattedProducts}
        isPromo={isPromo}
      />

      <View style={styles.cancelationInfo}>
        <AppText
          size={TextSize.LEVEL_2}
          weight={'600'}
          style={{color: colors.primaryTextColor}}
          text={t('common.can_be_cancelled_anytime')}
          lineHeight={11}
        />
        <AppText
          size={TextSize.LEVEL_1}
          weight={'600'}
          style={styles.description}
          text={t('common.paired_subscription')}
          lineHeight={11}
        />
      </View>
      <Button
        onPress={onPressHandler}
        style={styles.subscribeBtn}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          weight={'700'}
          size={TextSize.LEVEL_3}
          text={t('buy_now')}
        />
      </Button>
      <Button>
        <AppText
          size={TextSize.LEVEL_4}
          weight={'600'}
          style={styles.startForFree}
          text={t('common.start_for_free')}
          lineHeight={20}
        />
      </Button>
      <Button
        onPress={onPrivacyPolicyHandler}
        style={styles.termsAndPolicyWrapper}>
        <GradientText
          size={TextSize.LEVEL_3}
          weight={'500'}
          style={{color: colors.primaryTextColor}}
          text={t('auth.terms_of_policy')}
        />
      </Button>
    </View>
  );
};

export default memo(observer(InAppPurchase));

const styles = StyleSheet.create({
  InAppPurchase: {
    paddingBottom: verticalScale(20),
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  closeIcon: {
    position: 'absolute',
    right: horizontalScale(10),
    zIndex: 2,
    paddingHorizontal: horizontalScale(10),
  },
  images: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(20),
  },
  title: {
    textAlign: 'center',
  },
  subscribeBtn: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(15),
  },
  promoCode: {
    marginBottom: verticalScale(30),
  },
  benefitList: {
    marginBottom: verticalScale(20),
    marginTop: verticalScale(30),
  },
  cancelationInfo: {
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
  description: {
    marginTop: verticalScale(20),
  },
  termsAndPolicyWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  startForFree: {
    textDecorationLine: 'underline',
  },
  indicatorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
  },
});
