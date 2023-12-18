import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {validateFields} from '../services/validation/validateFields';
import {InvitePartnerFormErrorInfo} from '../types/invitePartnerTypes';

const errorInfoInitData: InvitePartnerFormErrorInfo = {
  emailError: '',
};

class InvitePartnerStore {
  partnerEmail: string = '';
  invitePartnerFormErrorInfo = errorInfoInitData;

  constructor() {
    makeAutoObservable(this);
  }

  setPartnerEmail = (email: string) => {
    this.partnerEmail = email;
  };

  setValidationError = (errorInfo: InvitePartnerFormErrorInfo) => {
    this.invitePartnerFormErrorInfo = errorInfo;
  };

  clearErrors() {
    this.setValidationError(errorInfoInitData);
  }

  resetForm() {
    this.setPartnerEmail('');
    this.clearErrors();
  }

  invitePartner = async (action: () => void) => {
    try {
      const {isError, errorInfo} = validateFields(this.partnerEmail);
      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }
      action();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new InvitePartnerStore();
