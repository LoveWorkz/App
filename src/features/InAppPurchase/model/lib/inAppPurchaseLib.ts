import {normaliseData} from '@src/shared/lib/common';
import { SubscriptionWithoutAmazon } from '../types/inAppPurchaseType';

export const normaliseProducts = (data: SubscriptionWithoutAmazon[]) => {
  const newDataWithId = data.map(item => {
    return {...item, id: item.productId};
  });

  return normaliseData(newDataWithId);
};
