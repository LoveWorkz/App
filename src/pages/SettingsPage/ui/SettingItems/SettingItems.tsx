import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AboutIcon} from '@src/shared/assets/icons/About';
import {ContactUsIcon} from '@src/shared/assets/icons/ContactUs';
import {HowToUseIcon} from '@src/shared/assets/icons/HowToUse';
import {PartnersIcon} from '@src/shared/assets/icons/Partners';
import {ProfileIcon} from '@src/shared/assets/icons/Profile';
import {Wrapper as SettingItem} from '../SettingItem/SettingItem';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

interface SettingItemsType {
  Icon: string;
  text: string;
  path?: AppRouteNames;
}

const itemsData: SettingItemsType[] = [
  {
    Icon: ProfileIcon,
    text: 'Profile',
    path: AppRouteNames.PROFILE,
  },
  {
    Icon: HowToUseIcon,
    text: 'How to use',
    // path: AppRouteNames.PROFILE,
  },
  {
    Icon: AboutIcon,
    text: 'About',
    path: AppRouteNames.ABOUT,
  },
  {
    Icon: ContactUsIcon,
    text: 'Contact us',
    // path: AppRouteNames.ABOUT,
  },
  {
    Icon: PartnersIcon,
    text: 'Partners',
    path: AppRouteNames.PARTNERS,
  },
];

const SettingItems = () => {
  return (
    <View style={styles.settingItems}>
      {itemsData.map(item => {
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

export const Wrapper = memo(SettingItems);

const styles = StyleSheet.create({
  settingItems: {
    width: 100,
  },
});
