import {TFunction} from 'i18next';

export const getPreferences = (t: TFunction) => {
  return [
    {
      label: t('profile.i_am_here_just_for_fun'),
      value: 'I_am_here_just_for_fun',
    },
    {
      label: t('profile.increase_intimacy_level'),
      value: 'Increase_our_intimacy_level',
    },
    {
      label: t('profile.increase_appreciation_and_respect'),
      value: 'Increase_appreciation_and_respect',
    },
    {
      label: t('profile.conlfict_management'),
      value: 'Conflict_management',
    },
    {
      label: t('profile.communication'),
      value: 'Communication',
    },
    {
      label: t('profile.self_reflection'),
      value: 'Self_reflection',
    },
    {
      label: t('profile.create_safe_attachment'),
      value: 'create_safe_attachment',
    },
  ];
};
