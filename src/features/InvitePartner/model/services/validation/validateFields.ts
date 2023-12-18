import {validateEmail} from '@src/shared/lib/validation/emailValidation';

import {InvitePartnerFormErrorInfo} from '../../types/invitePartnerTypes';

export const validateFields = (email: string) => {
  let isError = false;

  let errorInfo = {} as InvitePartnerFormErrorInfo;

  const {isEmailError, emailError} = validateEmail(email);
  isError = isError || isEmailError;
  errorInfo = {...errorInfo, ...emailError};

  return {isError, errorInfo};
};
