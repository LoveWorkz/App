import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {PartnerFormErrorType, PartnerFormType} from '../../types/partnerTypes';

export const validatePartnerFields = (formData: PartnerFormType) => {
  let isError = false;

  let errorInfo = {} as PartnerFormErrorType;

  const {age, name, email} = formData;

  if (!name) {
    errorInfo.nameError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  const {isEmailError, emailError} = validateEmail(email);
  isError = isError || isEmailError;
  errorInfo = {...errorInfo, ...emailError};

  const isAgeValid = !Number(age) || Number(age) > 100 || Number(age) < 0;

  if (isAgeValid) {
    errorInfo.ageError = ValidationErrorCodes.INVALID_AGE;
    isError = true;
  }

  if (!age) {
    errorInfo.ageError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  return {isError, errorInfo};
};
