import {makeAutoObservable, runInAction} from 'mobx';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {
  FormattedProductType,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import {formatProducts} from '../lib/inAppPurchaseLib';

class InAppPurchaseStore {
  isInAppPurchaseModalVisible: boolean = false;
  isFetching: boolean = true;

  formattedProducts: FormattedProductType | null = null;
  isPromo: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setIsInAppPurchaseModalVisible = (visible: boolean) => {
    this.isInAppPurchaseModalVisible = visible;
  };

  init = async (subscriptionsIds: string[]) => {
    try {
      this.setIsFetching(true);

      await initConnection();

      const products = await getSubscriptions({skus: subscriptionsIds});
      const formattedProducts = formatProducts(products);

      runInAction(() => {
        this.formattedProducts = formattedProducts;
      });
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
  };

  subscribe = async (subscriptionType: SubscriptionType) => {
    try {
      let productId;
      let offerToken;

      const formattedProducts = this.formattedProducts;
      if (!formattedProducts) {
        return;
      }

      switch (subscriptionType) {
        case SubscriptionType.YEARLY:
          const formattedYearly = formattedProducts.formattedYearly;
          productId = formattedYearly.productId;
          offerToken = formattedYearly.offerToken;

          break;
        default:
          const formattedMonthly = formattedProducts.formattedMonthly;
          productId = formattedMonthly.productId;
          offerToken = formattedMonthly.offerToken;
      }

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
