import {TFunction} from 'i18next';
import {SelectOption} from '@src/shared/types/types';

export const getGenderList = (t: TFunction): SelectOption[] => {
  return [
    {
      value: 'male',
      label: t('profile.male'),
    },
    {
      value: 'female',
      label: t('profile.female'),
    },
    {
      value: 'non_binary',
      label: t('profile.non_binary'),
    },
    {
      value: 'transgender',
      label: t('profile.transgender'),
    },
    {
      value: 'other',
      label: t('profile.other'),
    },
  ];
};
