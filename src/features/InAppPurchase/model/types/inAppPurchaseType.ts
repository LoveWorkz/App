// import {Subscription} from 'react-native-iap';

export type SubscriptionIdsKey =
  | 'MONTHLY'
  | 'YEARLY'
  | 'QUARTERLY'
  | 'MONTHLY_PROMO'
  | 'YEARLY_PROMO'
  | 'QUARTERLY_PROMO';

export type SubscriptionIdsType = Record<SubscriptionIdsKey, string>;

// export type SubscriptionWithoutAmazon = Omit<
//   Subscription,
//   'SubscriptionAmazon'
// >;

export interface PromoCodeResponse {
  message: string;
  valid: boolean;
}

export interface IosValidationSendingDataType {
  'receipt-data': string;
  password: string;
}

export interface AndroidValidationSendingDataType {
  productId: string;
  purchaseToken: string;
}

export interface ValidationResponseType {
  isExpired: boolean;
}
