import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import {AboutIcon} from '@src/shared/assets/icons/About';
import {ContactUsIcon} from '@src/shared/assets/icons/ContactUs';
import {HowToUseIcon} from '@src/shared/assets/icons/HowToUse';
import {PartnersIcon} from '@src/shared/assets/icons/Partners';
import {ProfileIcon} from '@src/shared/assets/icons/Profile';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import SettingItem from '../SettingItem/SettingItem';

interface SettingItemsType {
  Icon: string;
  text: string;
  path?: AppRouteNames;
}

const getItemsData = (t: TFunction): SettingItemsType[] => {
  return [
    {
      Icon: ProfileIcon,
      text: t('settings.profile'),
      path: AppRouteNames.PROFILE,
    },
    {
      Icon: HowToUseIcon,
      text: t('settings.how_to_use'),
      path: AppRouteNames.HOW_TO_USE,
    },
    {
      Icon: AboutIcon,
      text: t('settings.about'),
      path: AppRouteNames.ABOUT,
    },
    {
      Icon: ContactUsIcon,
      text: t('settings.contact_us'),
      path: AppRouteNames.CONTACT_US,
    },
    {
      Icon: PartnersIcon,
      text: t('settings.partners'),
      path: AppRouteNames.PARTNERS,
    },
  ];
};

const SettingItems = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.settingItems}>
      {getItemsData(t).map(item => {
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
