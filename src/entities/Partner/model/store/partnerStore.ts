import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {validatePartnerFields} from '../services/validation/validatePartnerFields';
import {
  PartnerFormErrorType,
  PartnerFormType,
  PartnerType,
} from '../types/partnerTypes';
import {profileStore} from '@src/entities/Profile';

const initErrorInfo: PartnerFormErrorType = {
  ageError: '',
  nameError: '',
  emailError: '',
};

class PartnerStore {
  partnerInitData = null as PartnerFormType | null;
  partnerForm = {} as PartnerFormType;
  errorInfo = initErrorInfo;

  isSaving: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.partnerForm.name = name;
  }

  setAge(age: number) {
    this.partnerForm.age = age;
  }

  setEmail(email: string) {
    this.partnerForm.email = email;
  }

  setValidationError(errorInfo: PartnerFormErrorType) {
    this.errorInfo = errorInfo;
  }

  setPartnerForm(data: PartnerFormType) {
    this.partnerForm = data;
  }

  setPartnerInitData(data: PartnerFormType) {
    this.partnerInitData = data;
  }

  setPartner(partner: PartnerType) {
    this.setPartnerForm(partner);
    this.setPartnerInitData(partner);
  }

  setIsSaving(isSaving: boolean) {
    this.isSaving = isSaving;
  }

  clearErrors() {
    this.setValidationError(initErrorInfo);
  }

  resetForm() {
    this.clearErrors();

    if (!this.partnerInitData) {
      return;
    }

    this.setPartnerForm(this.partnerInitData);
  }

  savePartner = async () => {
    try {
      crashlytics().log('User tried to update partner.');

      this.setIsSaving(true);

      this.clearErrors();
      const {isError, errorInfo} = validatePartnerFields(this.partnerForm);
      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }

      await userStore.updateUser({
        field: 'partner',
        data: this.partnerForm,
      });

      profileStore.setPartner(this.partnerForm);

      navigation.navigate(AppRouteNames.PROFILE);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsSaving(false);
    }
  };

  openPartnerPage(partner: PartnerType | null) {
    if (!partner) {
      return;
    }

    this.setPartner(partner);
    navigation.navigate(AppRouteNames.PARTNER_EDIT);
  }
}

export default new PartnerStore();
