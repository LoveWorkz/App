import {makeAutoObservable} from 'mobx';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {ProductMapType, SubscriptionsIds} from '../types/inAppPurchaseType';
import {normaliseProducts} from '../lib/inAppPurchaseLib';

class InAppPurchaseStore {
  products: any[] = [];
  productsMap: ProductMapType = {};
  isInAppPurchaseModalVisible: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsInAppPurchaseModalVisible = (visible: boolean) => {
    this.isInAppPurchaseModalVisible = visible;
  };

  setProducts = (products: any[]) => {
    this.products = products;
  };

  SetProductsMap = (products: any[]) => {
    this.productsMap = normaliseProducts(products);
  };

  init = async (items: string[]) => {
    try {
      await initConnection();

      const products = await getSubscriptions({skus: items});
      this.setProducts(products);
      this.SetProductsMap(products);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getYearlyAndMonthlySubscriptions = () => {
    const productsMap = this.productsMap;
    const monthly = productsMap[SubscriptionsIds.MONTHLY];
    const yearly = productsMap[SubscriptionsIds.YEARLY];

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
