import {Subscription} from 'react-native-iap';

export enum SubscriptionsIds {
  YEARLY = 'bline_sub_1y',
  MONTHLY = 'bline_sub_1m',
  QUARTERLY = 'bline_sub_3m',
}

export type SubscriptionWithoutAmazon = Omit<
  Subscription,
  'SubscriptionAmazon'
>;
