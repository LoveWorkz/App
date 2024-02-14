import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  FormattedProductType,
  SubscriptionBlock,
  SubscriptionBlockContentType,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import {verticalScale} from '@src/shared/lib/Metrics';

interface SubscriptionMethodsProps {
  formattedProducts: FormattedProductType;
  subscriptionType: SubscriptionType;
  setSubscriptionType: (value: SubscriptionType) => void;
}

const SubscriptionMethods = (props: SubscriptionMethodsProps) => {
  const {formattedProducts, subscriptionType, setSubscriptionType} = props;

  const {t} = useTranslation();

  const formattedMonthlyPrice =
    formattedProducts.formattedMonthly.localisedPrice;
  const formattedMonthlyPromoPrice =
    formattedProducts.formattedMonthlyPromo.localisedPrice;
  const formattedQuarterlyPrice =
    formattedProducts.formattedQuarterly.localisedPrice;
  const formattedQuarterlyPromoPrice =
    formattedProducts.formattedQuarterlyPromo.localisedPrice;
  const formattedYearlyPrice = formattedProducts.formattedYearly.localisedPrice;
  const formattedYearlyPromoPrice =
    formattedProducts.formattedYearlyPromo.localisedPrice;

  const subscriptionBlockData = useMemo<SubscriptionBlockContentType[]>(() => {
    return [
      {
        cost: formattedYearlyPrice,
        promoCost: formattedYearlyPromoPrice,
        duration: `12 ${t('months')}`,
        description: t('shop.yearly_description'),
        subscriptionType: SubscriptionType.YEARLY,
      },
      {
        cost: formattedQuarterlyPrice,
        promoCost: formattedQuarterlyPromoPrice,
        duration: `3 ${t('months')}`,
        description: t('shop.quarterly_description'),
        subscriptionType: SubscriptionType.QUARTERLY,
      },
      {
        cost: formattedMonthlyPrice,
        promoCost: formattedMonthlyPromoPrice,
        duration: `1 ${t('month')}`,
        description: t('shop.monthly_description'),
        subscriptionType: SubscriptionType.MONTHLY,
      },
    ];
  }, [
    formattedMonthlyPrice,
    formattedYearlyPromoPrice,
    formattedYearlyPrice,
    formattedMonthlyPromoPrice,
    formattedQuarterlyPrice,
    formattedQuarterlyPromoPrice,
  ]);

  return (
    <View style={styles.subscriptionBlocks}>
      {subscriptionBlockData.map(item => {
        return (
          <View key={item.subscriptionType} style={styles.item}>
            <SubscriptionBlock
              subscriptionBlockContent={item}
              chosenSubscriptionType={subscriptionType}
              setSubscriptionType={setSubscriptionType}
            />
          </View>
        );
      })}
    </View>
  );
};

export default memo(SubscriptionMethods);

const styles = StyleSheet.create({
  subscriptionBlocks: {
    width: '100%',
  },
  item: {
    marginBottom: verticalScale(15),
  },
});
