import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import {getAboutIcon} from '@src/shared/assets/icons/About';
import {getContactUsIcon} from '@src/shared/assets/icons/ContactUs';
import {getHowToUseIcon} from '@src/shared/assets/icons/HowToUse';
import {getPartnersIcon} from '@src/shared/assets/icons/Partners';
import {getProfileIcon} from '@src/shared/assets/icons/Profile';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import SettingItem from '../SettingItem/SettingItem';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

interface SettingItemsType {
  Icon: string;
  text: string;
  path?: AppRouteNames;
}

const getItemsData = ({
  t,
  isDarkMode,
}: {
  t: TFunction;
  isDarkMode: boolean;
}): SettingItemsType[] => {
  return [
    {
      Icon: getProfileIcon(isDarkMode),
      text: t('settings.profile'),
      path: AppRouteNames.PROFILE,
    },
    {
      Icon: getHowToUseIcon(isDarkMode),
      text: t('settings.how_to_use'),
      path: AppRouteNames.HOW_TO_USE,
    },
    {
      Icon: getAboutIcon(isDarkMode),
      text: t('settings.about'),
      path: AppRouteNames.ABOUT,
    },
    {
      Icon: getContactUsIcon(isDarkMode),
      text: t('settings.contact_us'),
      path: AppRouteNames.CONTACT_US,
    },
    {
      Icon: getPartnersIcon(isDarkMode),
      text: t('settings.partners'),
      path: AppRouteNames.PARTNERS,
    },
  ];
};

const SettingItems = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  const isDarkMode = theme === Theme.Dark;

  return (
    <View style={styles.settingItems}>
      {getItemsData({t, isDarkMode}).map(item => {
        return (
          <SettingItem
            Icon={item.Icon}
            text={item.text}
            key={item.text}
            path={item.path}
          />
        );
      })}
    </View>
  );
};

export default memo(SettingItems);

const styles = StyleSheet.create({
  settingItems: {
    width: 100,
  },
});
