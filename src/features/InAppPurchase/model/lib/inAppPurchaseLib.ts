import {SubscriptionAndroid, SubscriptionIOS} from 'react-native-iap';
import {Platform} from 'react-native';

import {FormattedProductValueType} from '@src/entities/SubscriptionBlock';
import {isPlatformIos} from '@src/shared/consts/common';
import {extractCurrencyAndPrice, normaliseData} from '@src/shared/lib/common';
import {
  SubscriptionIdsKey,
  SubscriptionIdsType,
  SubscriptionWithoutAmazon,
} from '../types/inAppPurchaseType';

export const subscriptionsIosIds: SubscriptionIdsType = {
  MONTHLY: 'bline_sub_1m_normal',
  YEARLY: 'bline_sub_1y_normal',
  QUARTERLY: 'bline_sub_3m_normal',
  MONTHLY_PROMO: 'bline_sub_1m_promo',
  YEARLY_PROMO: 'bline_sub_1y_promo',
  QUARTERLY_PROMO: 'bline_sub_3m_promo',
};

export const subscriptionsAndroidIds: SubscriptionIdsType = {
  MONTHLY: 'bline_sub_1m',
  YEARLY: 'bline_sub_1y',
  QUARTERLY: 'bline_sub_3m',
  MONTHLY_PROMO: 'bline_sub_1m_promo',
  YEARLY_PROMO: 'bline_sub_1y_promo',
  QUARTERLY_PROMO: 'bline_sub_3m_promo',
};

export const subscriptionsIds = Platform.select({
  ios: [
    subscriptionsIosIds.YEARLY,
    subscriptionsIosIds.MONTHLY,
    subscriptionsIosIds.QUARTERLY,
    subscriptionsIosIds.YEARLY_PROMO,
    subscriptionsIosIds.MONTHLY_PROMO,
    subscriptionsIosIds.QUARTERLY_PROMO,
  ],
  android: [
    subscriptionsAndroidIds.YEARLY,
    subscriptionsAndroidIds.MONTHLY,
    subscriptionsAndroidIds.QUARTERLY,
    subscriptionsAndroidIds.YEARLY_PROMO,
    subscriptionsAndroidIds.MONTHLY_PROMO,
    subscriptionsAndroidIds.QUARTERLY_PROMO,
  ],
});

const formattedKeyMap: Record<string, string> = {
  MONTHLY: 'formattedMonthly',
  QUARTERLY: 'formattedQuarterly',
  YEARLY: 'formattedYearly',
  MONTHLY_PROMO: 'formattedMonthlyPromo',
  QUARTERLY_PROMO: 'formattedQuarterlyPromo',
  YEARLY_PROMO: 'formattedYearlyPromo',
};

export const normaliseProducts = <T extends {productId: string}>(data: T[]) => {
  const newDataWithId = data.map(item => {
    return {...item, id: item.productId};
  });

  return normaliseData(newDataWithId);
};

export const formatProducts = (products: SubscriptionWithoutAmazon[]) => {
  if (isPlatformIos) {
    return getProducts<SubscriptionIOS>(
      products,
      subscriptionsIosIds,
      getIosMainProductInfo,
    );
  }

  return getProducts<SubscriptionAndroid>(
    products,
    subscriptionsAndroidIds,
    getAndroidMainProductInfo,
  );
};

const getProducts = <T>(
  products: SubscriptionWithoutAmazon[],
  subscriptionIds: SubscriptionIdsType,
  getMainProductInfo: (products: T) => FormattedProductValueType,
) => {
  const productsMap = normaliseProducts(products);

  if (!subscriptionIds) {
    return null;
  }

  const formattedProducts = Object.keys(subscriptionIds).reduce(
    (result: any, key) => {
      const productKey = subscriptionIds[key as SubscriptionIdsKey];
      const product = productsMap[productKey] || null;

      if (product) {
        const formattedKey = formattedKeyMap[key];
        result[formattedKey] = getMainProductInfo(product as T);
      }

      return result;
    },
    {},
  );

  return formattedProducts;
};

const getAndroidMainProductInfo = (
  product: SubscriptionAndroid,
): FormattedProductValueType => {
  const offerToken = product.subscriptionOfferDetails[0].offerToken;
  const localisedPrice =
    product.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0]
      .formattedPrice;

  const {currency, price} = extractCurrencyAndPrice(localisedPrice);    

  return {
    productId: product.productId,
    localisedPrice,
    offerToken,
    price: price ? `${price}` : '',
    currency: currency || '',
  };
};

const getIosMainProductInfo = (
  product: SubscriptionIOS,
): FormattedProductValueType => {
  const localisedPrice = product.localizedPrice;

  const {currency, price} = extractCurrencyAndPrice(localisedPrice); 
  
  return {
    productId: product.productId,
    localisedPrice,
    price: price ? `${price}` : '',
    currency: currency || '',
  };
};
