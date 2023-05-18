import {TFunction} from 'i18next';

export const getRelationshipStatusOptions = (t: TFunction) => {
  return [
    {label: `< 1 ${t('year')}`, value: '1_year'},
    {label: `> 2 ${t('year')}`, value: '2_year'},
    {label: `> 3 ${t('year')}`, value: '3_year'},
    {label: `> 4 ${t('year')}`, value: '4_year'},
  ];
};
