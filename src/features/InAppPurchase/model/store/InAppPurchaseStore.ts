import {makeAutoObservable, runInAction} from 'mobx';
import {t} from 'i18next';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
  getPurchaseHistory,
} from 'react-native-iap';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {IOS_SUBSCRIPTINON_SECRET_KEY} from '@src/app/config/appConfig/config/appConfig';
import {isPlatformIos} from '@src/shared/consts/common';
import {
  FormattedProductType,
  SubscriptionType,
} from '@src/entities/SubscriptionBlock';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {userStore} from '@src/entities/User';
import {formatProducts, subscriptionsIds} from '../lib/inAppPurchaseLib';
import {checkPromoCode, validateAndroid, validateIos} from '../services/api';
import {
  AndroidValidationSendingDataType,
  IosValidationSendingDataType,
} from '../types/inAppPurchaseType';

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
  };

  setIsPromo = (isPromo: boolean) => {
    this.isPromo = isPromo;
  };

  setPromoCodeErrorMessage = (message: string) => {
    this.promoCodeErrorMessage = message;
  };

  setIsCheckingPromoCode = (isChecking: boolean) => {
    this.isCheckingPromoCode = isChecking;
  };

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setIsInAppPurchaseModalVisible = (visible: boolean) => {
    this.isInAppPurchaseModalVisible = visible;
  };

  init = async () => {
    try {
      crashlytics().log('Init subscription popup');

      this.setIsFetching(true);

      await initConnection();

      const products = await getSubscriptions({
        skus: subscriptionsIds as string[],
      });
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
      crashlytics().log('Subscribe');

      let productId;
      let offerToken;
      const isPromo = this.isPromo;

      const formattedProducts = this.formattedProducts;
      if (!formattedProducts) {
        return;
      }

      switch (subscriptionType) {
        case SubscriptionType.YEARLY:
          const formattedYearlyKey = isPromo
            ? 'formattedYearlyPromo'
            : 'formattedYearly';

          const formattedYearly = formattedProducts[formattedYearlyKey];
          productId = formattedYearly.productId;
          offerToken = formattedYearly.offerToken;

          break;
        case SubscriptionType.QUARTERLY:
          const formattedQuarterlyKey = isPromo
            ? 'formattedQuarterlyPromo'
            : 'formattedQuarterly';

          const formattedQuarterly = formattedProducts[formattedQuarterlyKey];
          productId = formattedQuarterly.productId;
          offerToken = formattedQuarterly.offerToken;

          break;
        default:
          const formattedMonthlyKey = isPromo
            ? 'formattedMonthlyPromo'
            : 'formattedMonthly';

          const formattedMonthly = formattedProducts[formattedMonthlyKey];
          productId = formattedMonthly.productId;
          offerToken = formattedMonthly.offerToken;
      }

      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{sku: productId, offerToken}],
        }),
      });
    } catch (e: any) {
      this.purchaseErrorHandler(e);
    }
  };

  checkPromoCode = async () => {
    try {
      crashlytics().log('Checking user promo code');

      const promoCode = this.promoCode;
      if (!promoCode) {
        this.setPromoCodeErrorMessage(
          t(ValidationErrorCodes.FIELD_IS_REQUIRED),
        );
        return;
      }

      this.setIsCheckingPromoCode(true);

      const result = await checkPromoCode(promoCode);
      if (result.valid) {
        this.setIsPromo(true);
        this.setPromoCodeErrorMessage('');
        this.setPromoCode('');
      } else {
        this.setPromoCodeErrorMessage(result.message);
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsCheckingPromoCode(false);
    }
  };

  purchaseUpdatedHandler = async (token: string) => {
    try {
      const result = await this.validate(token);

      if (result.isExpired) {
        userStore.setHasUserSubscription(false);
      } else {
        userStore.setHasUserSubscription(true);
        this.setIsInAppPurchaseModalVisible(false);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  purchaseErrorHandler = async (error: any) => {
    const code = error.code;

    if (!(code === 'E_USER_CANCELLED')) {
      errorHandler({error});
    }
  };

  checkIfUserHasSubscription = async () => {
    if (userStore.inited) {
      return;
    }

    if (__DEV__ || !isPlatformIos) {
      return;
    }

    crashlytics().log('Checking if user has subscription');

    const purchaseHistory = await getPurchaseHistory();
    const receipt =
      purchaseHistory[purchaseHistory.length - 1].transactionReceipt;
    if (receipt) {
      const result = await this.validate(receipt);

      if (result.isExpired) {
        userStore.setHasUserSubscription(false);
      } else {
        userStore.setHasUserSubscription(true);
      }
    }
  };

  validate = async (token: string) => {
    try {
      if (isPlatformIos) {
        const result = await this.validateIos(token);
        return result;
      }

      const result = await this.validateAndroid(token);
      return result;
    } catch (e) {
      errorHandler({error: e, withToast: false});
      return {isExpired: true};
    }
  };

  validateIos = async (token: string) => {
    crashlytics().log('Validating ios receipt token');

    const sendingData: IosValidationSendingDataType = {
      'receipt-data': token,
      password: IOS_SUBSCRIPTINON_SECRET_KEY,
    };

    const result = await validateIos(sendingData);
    return result;
  };

  validateAndroid = async (token: string) => {
    crashlytics().log('Validating android receipt token');

    const productId = JSON.parse(token).productId;
    const purchaseToken = JSON.parse(token).purchaseToken;

    const sendingData: AndroidValidationSendingDataType = {
      productId,
      purchaseToken,
    };

    const result = await validateAndroid(sendingData);
    return result;
  };
}

export default new InAppPurchaseStore();
