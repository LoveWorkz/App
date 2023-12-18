import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {Profile, ProfileErrorInfo} from '../../types/profileSchema';

export const validateFields = (formData: Profile) => {
  let isError = false;

  let errorInfo = {} as ProfileErrorInfo;

  const {name, email, gender, country} = formData;

  if (!name) {
    errorInfo.nameError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!gender) {
    errorInfo.genderError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!country) {
    errorInfo.countryError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  const {isEmailError, emailError} = validateEmail(email);
  isError = isError || isEmailError;
  errorInfo = {...errorInfo, ...emailError};

  return {isError, errorInfo};
};
