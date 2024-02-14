export enum SubscriptionType {
  MONTHLY = 'monthly',
  YEARLY = 'yearyl',
  QUARTERLY = 'quarterly',
}

export interface FormattedProductValueType {
  productId: string;
  localisedPrice: string;
  offerToken?: string;
}

export interface FormattedProductType {
  formattedMonthly: FormattedProductValueType;
  formattedQuarterly: FormattedProductValueType;
  formattedYearly: FormattedProductValueType;

  formattedMonthlyPromo: FormattedProductValueType;
  formattedQuarterlyPromo: FormattedProductValueType;
  formattedYearlyPromo: FormattedProductValueType;
}

export interface SubscriptionBlockContentType {
  duration: string;
  description: string;
  cost: string;
  promoCost: string;
  subscriptionType: SubscriptionType;
}
