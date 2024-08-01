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
import {
  monthlyToWeekly,
  threeMonthsToWeekly,
  yearlyToWeekly,
} from '@src/shared/lib/common';

interface SubscriptionMethodsProps {
  formattedProducts: FormattedProductType;
  subscriptionType: SubscriptionType;
  setSubscriptionType: (value: SubscriptionType) => void;
  isPromo: boolean;
}

const SubscriptionMethods = (props: SubscriptionMethodsProps) => {
  const {formattedProducts, subscriptionType, setSubscriptionType, isPromo} =
    props;

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
        duration: `12 ${t('common.months')}`,
        description: t('shop.yearly_description'),
        subscriptionType: SubscriptionType.YEARLY,
        perWeekCost: `${yearlyToWeekly(
          +(isPromo
            ? formattedProducts.formattedYearlyPromo.price
            : formattedProducts.formattedYearly.price),
        )} ${formattedProducts.formattedYearly.currency}`,
      },
      {
        cost: formattedQuarterlyPrice,
        promoCost: formattedQuarterlyPromoPrice,
        duration: `3 ${t('common.months')}`,
        description: t('shop.quarterly_description'),
        subscriptionType: SubscriptionType.QUARTERLY,
        perWeekCost: `${threeMonthsToWeekly(
          +(isPromo
            ? formattedProducts.formattedQuarterlyPromo.price
            : formattedProducts.formattedQuarterly.price),
        )} ${formattedProducts.formattedQuarterly.currency}`,
      },
      {
        cost: formattedMonthlyPrice,
        promoCost: formattedMonthlyPromoPrice,
        duration: `1 ${t('common.month')}`,
        description: t('shop.monthly_description'),
        subscriptionType: SubscriptionType.MONTHLY,
        perWeekCost: `${monthlyToWeekly(
          +(isPromo
            ? formattedProducts.formattedMonthlyPromo.price
            : formattedProducts.formattedMonthly.price),
        )} ${formattedProducts.formattedMonthly.currency}`,
      },
    ];
  }, [
    formattedYearlyPrice,
    formattedYearlyPromoPrice,
    t,
    isPromo,
    formattedProducts.formattedYearlyPromo.price,
    formattedProducts.formattedYearly.price,
    formattedProducts.formattedYearly.currency,
    formattedProducts.formattedQuarterlyPromo.price,
    formattedProducts.formattedQuarterly.price,
    formattedProducts.formattedQuarterly.currency,
    formattedProducts.formattedMonthlyPromo.price,
    formattedProducts.formattedMonthly.price,
    formattedProducts.formattedMonthly.currency,
    formattedQuarterlyPrice,
    formattedQuarterlyPromoPrice,
    formattedMonthlyPrice,
    formattedMonthlyPromoPrice,
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
              isPromo={isPromo}
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
