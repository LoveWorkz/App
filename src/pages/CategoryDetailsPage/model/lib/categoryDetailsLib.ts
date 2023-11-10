import {TFunction} from 'i18next';

export const getCategoryDetailsLockedPopupContent = (t: TFunction) => {
  return {
    title: t('categories.lockPopupTitle'),
    text: t('categories.lockPopupText'),
  };
};
