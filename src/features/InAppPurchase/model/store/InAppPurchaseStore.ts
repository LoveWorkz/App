import {makeAutoObservable} from 'mobx';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {SubscriptionsIds} from '../types/inAppPurchaseType';

class InAppPurchaseStore {
  subscriptions: any = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSubscriptions = async (products: any) => {
    this.subscriptions = products;
  };

  init = async (items: string[]) => {
    try {
      await initConnection();
      const subscriptions = await getSubscriptions({skus: items});
      this.setSubscriptions(subscriptions);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getYearlyAndMonthlySubscriptions = (products: any[]) => {
    const monthly = products.find(
      (product: any) => product.productId === SubscriptionsIds.MONTHLY,
    );
    const yearly = products.find(
      (product: any) => product.productId === SubscriptionsIds.YEARYL,
    );

    return {monthly: monthly || null, yearly: yearly || null};
  };

  subscribe = async ({
    productId,
    offerToken,
  }: {
    productId: string;
    offerToken: string;
  }) => {
    try {
      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{sku: productId, offerToken}],
        }),
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new InAppPurchaseStore();
