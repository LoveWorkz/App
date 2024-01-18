import {SubscriptionAndroid, SubscriptionIOS} from 'react-native-iap';

import {FormattedProductValueType} from '@src/entities/SubscriptionBlock';
import {isPlatformIos} from '@src/shared/consts/common';
import {normaliseData} from '@src/shared/lib/common';
import {
  SubscriptionsIds,
  SubscriptionWithoutAmazon,
} from '../types/inAppPurchaseType';

export const normaliseProducts = <T extends {productId: string}>(data: T[]) => {
  const newDataWithId = data.map(item => {
    return {...item, id: item.productId};
  });

  return normaliseData(newDataWithId);
};

export const formatProducts = (products: SubscriptionWithoutAmazon[]) => {
  if (isPlatformIos) {
    return getIosProducts(products as SubscriptionIOS[]);
  }

  return getAndroidProducts(products as SubscriptionAndroid[]);
};

const getIosProducts = (products: SubscriptionIOS[]) => {
  const productsMap = getProductsMap(products);

  return {
    formattedMonthly: getIosMainProductInfo(productsMap.monthly),
    formattedQuarterly: getIosMainProductInfo(productsMap.quarterly),
    formattedYearly: getIosMainProductInfo(productsMap.yearly),
  };
};

const getAndroidProducts = (products: SubscriptionAndroid[]) => {
  const productsMap = getProductsMap(products);

  return {
    formattedMonthly: getAndroidMainProductInfo(productsMap.monthly),
    formattedQuarterly: getAndroidMainProductInfo(productsMap.quarterly),
    formattedYearly: getAndroidMainProductInfo(productsMap.yearly),
  };
};

const getProductsMap = <T extends {productId: string}>(products: T[]) => {
  const productsMap = normaliseProducts<T>(products);

  const monthly = productsMap[SubscriptionsIds.MONTHLY] || null;
  const yearly = productsMap[SubscriptionsIds.YEARLY] || null;
  const quarterly = productsMap[SubscriptionsIds.QUARTERLY] || null;

  return {yearly, monthly, quarterly};
};

const getAndroidMainProductInfo = (
  product: SubscriptionAndroid,
): FormattedProductValueType => {
  const offerToken = product.subscriptionOfferDetails[0].offerToken;
  const localisedPrice =
    product.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0]
      .formattedPrice;

  return {
    productId: product.productId,
    localisedPrice,
    offerToken,
  };
};

const getIosMainProductInfo = (
  product: SubscriptionIOS,
): FormattedProductValueType => {
  const localisedPrice = product.localizedPrice;

  return {
    productId: product.productId,
    localisedPrice,
  };
};
