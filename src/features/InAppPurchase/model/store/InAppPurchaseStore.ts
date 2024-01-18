import {makeAutoObservable, runInAction} from 'mobx';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {ProductMapType, SubscriptionWithoutAmazon, SubscriptionsType} from '../types/inAppPurchaseType';
import {normaliseProducts} from '../lib/inAppPurchaseLib';

class InAppPurchaseStore {
  products: SubscriptionWithoutAmazon[] = [];
  productsMap: ProductMapType = {};
  isInAppPurchaseModalVisible: boolean = false;
  isFetching: boolean = true;
  monthly: SubscriptionWithoutAmazon | null = null;
  yearly: SubscriptionWithoutAmazon | null = null;
  quarterly: SubscriptionWithoutAmazon | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  }

  setIsInAppPurchaseModalVisible = (visible: boolean) => {
    this.isInAppPurchaseModalVisible = visible;
  };

  setProducts = (products: SubscriptionWithoutAmazon[]) => {
    this.products = products;
  };

  init = async (items: string[]) => {
    try {
      this.setIsFetching(true);

      await initConnection();

      const products = await getSubscriptions({skus: items});
      const productsMap = normaliseProducts(products as SubscriptionWithoutAmazon[]);

      runInAction(() => {
        this.monthly = productsMap[SubscriptionsType.MONTHLY];
        this.yearly = productsMap[SubscriptionsType.YEARLY];
        this.quarterly = productsMap[SubscriptionsType.QUARTERLY];

        this.productsMap = productsMap;
      });

      this.setProducts(products as SubscriptionWithoutAmazon[]);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
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
