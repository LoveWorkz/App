import {TFunction} from 'i18next';

import {SelectOption} from '@src/shared/types/types';

export const getRelationshipStatusItems = (t: TFunction): SelectOption[] => {
  return [
    {
      value: 'in_a_relatioship',
      label: t('myRelationship.in_a_relatioship'),
    },
    {
      value: 'engaged',
      label: t('myRelationship.engaged'),
    },
    {
      value: 'married',
      label: t('myRelationship.married'),
    },
    {
      value: 'civil_partnership',
      label: t('myRelationship.civil_partnership'),
    },
  ];
};

export const getDoYouLiveTogetherItems = (t: TFunction): SelectOption[] => {
  return [
    {
      value: 'We_live_together',
      label: t('myRelationship.We_live_together'),
    },

    {
      value: 'We_live_separately',
      label: t('myRelationship.We_live_separately'),
    },
    {
      value: 'part_time',
      label: t('myRelationship.part_time'),
    },
  ];
};

export const getDoYouHaveKidsItems = (t: TFunction): SelectOption[] => {
  return [
    {
      value: 'both_of_us',
      label: t('myRelationship.both_of_us'),
    },

    {
      value: 'one_of_us',
      label: t('myRelationship.one_of_us'),
    },
    {
      value: '1_kid',
      label: t('myRelationship.1_kid'),
    },
    {
      value: '2_kids_more',
      label: t('myRelationship.2_kids_more'),
    },
    {
      value: 'no',
      label: t('myRelationship.no'),
    },
  ];
};
