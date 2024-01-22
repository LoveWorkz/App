import {Subscription} from 'react-native-iap';

export type SubscriptionIdsKey =
  | 'MONTHLY'
  | 'YEARLY'
  | 'QUARTERLY'
  | 'MONTHLY_PROMO'
  | 'YEARLY_PROMO'
  | 'QUARTERLY_PROMO';

export type SubscriptionIdsType = Record<SubscriptionIdsKey, string>;

export type SubscriptionWithoutAmazon = Omit<
  Subscription,
  'SubscriptionAmazon'
>;
