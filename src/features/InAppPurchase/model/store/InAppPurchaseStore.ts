import { makeAutoObservable, runInAction } from 'mobx';
import { t } from 'i18next';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
  getPurchaseHistory,
} from 'react-native-iap';

import { errorHandler } from '@src/shared/lib/errorHandler/errorHandler';
import { IOS_SUBSCRIPTINON_SECRET_KEY } from '@src/app/config/appConfig/config/appConfig';
import { isPlatformIos } from '@src/shared/consts/common';
import {
  FormattedProductType,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import { ValidationErrorCodes } from '@src/shared/types/validation';
import { userStore } from '@src/entities/User';
import { formatProducts, subscriptionsIds } from '../lib/inAppPurchaseLib';
import { checkPromoCode, validateAndroid, validateIos } from '../services/api';
import { IosValidationSendingDataType, ValidationResponseType } from '../types/inAppPurchaseType';

class InAppPurchaseStore {
  isInAppPurchaseModalVisible: boolean = false;
  isFetching: boolean = true;

  formattedProducts: FormattedProductType | null = null;
  isPromo: boolean = false;
  promoCode: string = '';
  promoCodeErrorMessage: string = '';
  isCheckingPromoCode: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPromoCode = (promoCode: string) => {
    this.promoCode = promoCode;
  }

  setIsPromo = (isPromo: boolean) => {
    this.isPromo = isPromo;
  }

  setPromoCodeErrorMessage = (message: string) => {
    this.promoCodeErrorMessage = message;
  }

  setIsCheckingPromoCode = (isChecking: boolean) => {
    this.isCheckingPromoCode = isChecking;
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setIsInAppPurchaseModalVisible = (visible: boolean) => {
    this.isInAppPurchaseModalVisible = visible;
  };

  init = async () => {
    try {
      this.setIsFetching(true);

      await initConnection();

      const products = await getSubscriptions({ skus: subscriptionsIds as string[] });
      const formattedProducts = formatProducts(products);

      runInAction(() => {
        this.formattedProducts = formattedProducts;
      });
    } catch (e) {
      errorHandler({ error: e });
    } finally {
      this.setIsFetching(false);
    }
  };

  subscribe = async (subscriptionType: SubscriptionType) => {
    try {
      let productId;
      let offerToken;
      const isPromo = this.isPromo;

      const formattedProducts = this.formattedProducts;
      if (!formattedProducts) {
        return;
      }

      switch (subscriptionType) {
        case SubscriptionType.YEARLY:
          const formattedYearlyKey = isPromo ? 'formattedYearlyPromo' : 'formattedYearly';
          const formattedYearly = formattedProducts[formattedYearlyKey];
          productId = formattedYearly.productId;
          offerToken = formattedYearly.offerToken;

          break;
        default:
          const formattedMonthlyKey = isPromo ? 'formattedMonthlyPromo' : 'formattedMonthly'
          const formattedMonthly = formattedProducts[formattedMonthlyKey];
          productId = formattedMonthly.productId;
          offerToken = formattedMonthly.offerToken;
      }

      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: productId, offerToken }],
        }),
      });
    } catch (e) {
      errorHandler({ error: e });
    }
  };

  checkPromoCode = async () => {
    try {
      const promoCode = this.promoCode;
      if (!promoCode) {
        this.setPromoCodeErrorMessage(t(ValidationErrorCodes.FIELD_IS_REQUIRED));
        return;
      };

      this.setIsCheckingPromoCode(true);

      const result = await checkPromoCode(promoCode);
      if (result.valid) {
        this.setIsPromo(true);
        this.setPromoCodeErrorMessage('');
        this.setPromoCode('')
      } else {
        this.setPromoCodeErrorMessage(result.message);
      }
    } catch (e) {
      errorHandler({ error: e });
    } finally {
      this.setIsCheckingPromoCode(false);
    }
  }

  purchaseUpdatedListener = async (token: string) => {
    try {
      const result = await this.validate(token);
      this.handleValidationResult(result);
      this.setIsInAppPurchaseModalVisible(false);
    } catch (e) {
      errorHandler({ error: e });
    }
  }

  validate = async (token: string) => {
    try {
      if (isPlatformIos) {
        const sendingData: IosValidationSendingDataType = {
          "receipt-data": token,
          password: IOS_SUBSCRIPTINON_SECRET_KEY,
        }

        const result = await validateIos(sendingData);
        return result;
      }

      const result = await validateAndroid(token);
      return result;
    } catch (e) {
      errorHandler({ error: e });
      return { valid: false }
    }
  }

  handleValidationResult = ({ valid }: ValidationResponseType) => {
    if (valid) {
      userStore.setHasUserSubscription(true);
    } else {
      userStore.setHasUserSubscription(false);
    }
  }

  checkIfUserHasSubscription = async () => {
    const purchaseHistory = await getPurchaseHistory();

    const receipt = purchaseHistory[purchaseHistory.length - 1].transactionReceipt;
    if (receipt) {
      const result = await this.validate(receipt);
      this.handleValidationResult(result);
    }
  }
}

export default new InAppPurchaseStore();
