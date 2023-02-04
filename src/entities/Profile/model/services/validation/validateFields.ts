import {ValidationErrorCodes} from '@src/shared/types/validation';
import {Profile, ProfileErrorInfo} from '../../types/profileSchema';

export const validateFields = (formData: Profile) => {
  let isError = false;

  let errorInfo = {} as ProfileErrorInfo;

  const {age, name, rubric} = formData;

  if (!name) {
    errorInfo.nameError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!rubric) {
    errorInfo.rubricError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!age) {
    errorInfo.ageError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  const isAgeValid = !Number(age) || Number(age) > 100 || Number(age) < 0;

  if (isAgeValid) {
    errorInfo.ageError = ValidationErrorCodes.INVALID_AGE;
    isError = true;
  }

  return {isError, errorInfo};
};
