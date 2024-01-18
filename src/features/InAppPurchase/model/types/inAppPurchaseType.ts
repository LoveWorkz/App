import {SubscriptionAndroid} from 'react-native-iap';

export enum SubscriptionsType {
  YEARLY = 'bline_sub_1y',
  MONTHLY = 'bline_sub_1m',
  QUARTERLY = 'bline_sub_3m',
}

export type SubscriptionWithoutAmazon = SubscriptionAndroid;

export type ProductMapType = Record<string, SubscriptionWithoutAmazon>;
