import React, {memo, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useHeaderHeight} from '@react-navigation/elements';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {windowHeightMinusPaddings} from '@src/app/styles/GlobalStyle';
import {ThemeSwitcher} from '@src/widgets/ThemeSwitcher';
import {LanguageSwitcher} from '@src/widgets/LanguageSwitcher';
import {isPlatformIos} from '@src/shared/consts/common';
import {LanguageIcon} from '@src/shared/assets/icons/Language';
import {ThemeIcon} from '@src/shared/assets/icons/Theme';
import {NotificationIcon} from '@src/shared/assets/icons/Notification';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {LogOut} from '@src/features/LogOut';
import SettingGroup from './SettingGroup/SettingGroup';
import ShareUs from './ShareUs/ShareUs';
import {SettingItemType} from '../model/types/settingsType';
import {
  getAboutLoveWorkzItems,
  getAccountItems,
  getMoreItems,
  getSubscriptionItems,
} from '../model/lib/settingslib';

const SettingsPage = () => {
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();

  const {t} = useTranslation();

  const [isLanguagePopupVisible, setIsLanguagePopupVisible] = useState(false);

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

  const accountItems = getAccountItems({t, isDarkMode: false});
  const subscriptionItems = getSubscriptionItems(t);
  const aboutLoveWorkzItems = getAboutLoveWorkzItems({t, isDarkMode: false});
  const moreItems = getMoreItems({t, isDarkMode: false});

  const preferencesItems = useMemo<SettingItemType[]>(() => {
    return [
      {
        Icon: NotificationIcon,
        text: t('settings.notifications'),
        path: AppRouteNames.NOTIFICATIONS,
      },
      {
        Icon: LanguageIcon,
        text: t('settings.language'),
        onPress: () => {
          setIsLanguagePopupVisible(true);
        },
      },
      {
        Icon: ThemeIcon,
        text: t('settings.dark_mode'),
        RightSideComponent: <ThemeSwitcher />,
        isPressable: false,
      },
    ];
  }, [t]);

  return (
    <View
      style={[
        styles.settings,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight,
        },
      ]}>
      <View style={styles.settingGroupItem}>
        <SettingGroup
          title={t('settings.preferences')}
          items={preferencesItems}
        />
      </View>
      <View style={styles.settingGroupItem}>
        <SettingGroup title={t('settings.account')} items={accountItems} />
      </View>
      <View style={styles.settingGroupItem}>
        <SettingGroup
          title={t('settings.subscription')}
          items={subscriptionItems}
        />
      </View>
      <View style={styles.settingGroupItem}>
        <SettingGroup
          title={t('settings.about_loveWorkz')}
          items={aboutLoveWorkzItems}
        />
      </View>
      <View style={styles.settingGroupItem}>
        <SettingGroup title={t('settings.links_more')} items={moreItems} />
      </View>

      <LanguageSwitcher
        setIsLanguagePopupVisible={setIsLanguagePopupVisible}
        isLanguagePopupVisible={isLanguagePopupVisible}
      />
      <View style={styles.bottomBlock}>
        <View style={styles.shareUs}>
          <ShareUs />
        </View>
        <View style={styles.logoutWrapper}>
          <LogOut />
        </View>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(SettingsPage);

const styles = StyleSheet.create({
  settings: {
    paddingBottom: verticalScale(180),
  },
  settingGroupItem: {
    marginBottom: verticalScale(30),
  },

  bottomBlock: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(50),
  },
  shareUs: {
    marginBottom: verticalScale(25),
  },
  logoutWrapper: {
    alignItems: 'center',
  },
});
