import React, {memo, useMemo, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
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
import {InvitePartnerModal} from '@src/features/InvitePartner';
import {getProfileIcon} from '@src/shared/assets/icons/Profile';
import {YourGoalsIcon} from '@src/shared/assets/icons/YourGoals';
import {InvitePartnerIcon} from '@src/shared/assets/icons/InvitePartner';
import {HeartIcon} from '@src/shared/assets/icons/Heart';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import SettingGroup from './SettingGroup/SettingGroup';
import ShareUs from './ShareUs/ShareUs';
import {SettingItemType} from '../model/types/settingsType';
import {
  getAboutLoveWorkzItems,
  getMoreItems,
  getSubscriptionItems,
} from '../model/lib/settingslib';
import {useColors} from '@src/app/providers/colorsProvider';

const SettingsPage = () => {
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();

  const colors = useColors();
  const {isDark} = useTheme();

  const {t} = useTranslation();
  const {theme} = useTheme();
  const isDarkMode = theme === Theme.Dark;

  const [isLanguagePopupVisible, setIsLanguagePopupVisible] = useState(false);
  const [isPartnerPopupVisible, setIsPartnerPopupVisible] = useState(false);

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

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

  const accountItems = useMemo<SettingItemType[]>(() => {
    return [
      {
        Icon: getProfileIcon(isDarkMode),
        text: t('settings.about_me'),
        path: AppRouteNames.PROFILE,
      },
      {
        Icon: HeartIcon,
        text: t('settings.about_my_relationship'),
        path: AppRouteNames.ABOUT_MY_RELATIONSHIP,
      },
      {
        Icon: InvitePartnerIcon,
        text: t('settings.invite_partner'),
        onPress: () => {
          setIsPartnerPopupVisible(true);
        },
      },
      {
        Icon: YourGoalsIcon,
        text: t('settings.your_goals'),
        path: AppRouteNames.YOUR_GOALS,
      },
    ];
  }, [isDarkMode, t]);

  return (
    <View
      style={[
        styles.settings,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight,
        },
      ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgColor}
      />

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
        <InvitePartnerModal
          visible={isPartnerPopupVisible}
          setVisible={setIsPartnerPopupVisible}
        />
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
    bottom: verticalScale(70),
  },
  shareUs: {
    marginBottom: verticalScale(25),
  },
  logoutWrapper: {
    alignItems: 'center',
  },
});
