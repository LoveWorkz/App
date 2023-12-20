import {TFunction} from 'i18next';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {RestorePurchaseIcon} from '@src/shared/assets/icons/RestorePurchase';
import {ManageSubscriptionIcon} from '@src/shared/assets/icons/ManageSubscription';
import {getAboutIcon} from '@src/shared/assets/icons/About';
import {getHowToUseIcon} from '@src/shared/assets/icons/HowToUse';
import {getOurSpecialistIcon} from '@src/shared/assets/icons/OurSpecialist';
import {InstagramIcon} from '@src/shared/assets/icons/Instagram';
import {HomeIconOutline} from '@src/shared/assets/icons/Home';
import {PrivacyPolicyIcon} from '@src/shared/assets/icons/PrivacyPolicy';
import {SettingItemType} from '../types/settingsType';

export const getSubscriptionItems = (t: TFunction): SettingItemType[] => {
  return [
    {
      Icon: RestorePurchaseIcon,
      text: t('settings.restore_purchase'),
      isPressable: false,
    },
    {
      Icon: ManageSubscriptionIcon,
      text: t('settings.manage_my_subscription'),
      isPressable: false,
    },
  ];
};

export const getAboutLoveWorkzItems = ({
  t,
  isDarkMode,
}: {
  t: TFunction;
  isDarkMode: boolean;
}): SettingItemType[] => {
  return [
    {
      Icon: getAboutIcon(isDarkMode),
      text: t('settings.about'),
      path: AppRouteNames.ABOUT,
    },
    {
      Icon: getHowToUseIcon(isDarkMode),
      text: t('settings.how_to_use'),
      path: AppRouteNames.HOW_TO_USE,
    },
    {
      Icon: getOurSpecialistIcon(isDarkMode),
      text: t('settings.our_specialists'),
      path: AppRouteNames.PARTNERS,
    },
  ];
};

export const getMoreItems = ({
  t,
  isDarkMode,
}: {
  t: TFunction;
  isDarkMode: boolean;
}): SettingItemType[] => {
  return [
    {
      Icon: InstagramIcon,
      text: t('settings.follow_us_on_instagram'),
      isPressable: false,
    },
    {
      Icon: HomeIconOutline,
      text: t('settings.our_homepage'),
      isPressable: false,
    },
    {
      Icon: getHowToUseIcon(isDarkMode),
      text: t('settings.terms_of_use'),
      path: AppRouteNames.PRIVACY_POLICY,
    },
    {
      Icon: PrivacyPolicyIcon,
      text: t('settings.privacy_policy_item'),
      path: AppRouteNames.PRIVACY_POLICY,
    },
  ];
};
