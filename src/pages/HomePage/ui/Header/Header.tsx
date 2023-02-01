import React, {useCallback, memo} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

interface HeaderProps {
  style?: Record<string, string | number>;
  imageUrl: string;
  name: string;
}

const Header = (props: HeaderProps) => {
  const {style, imageUrl, name} = props;
  const {t} = useTranslation();

  const onSettingsPressHandler = useCallback(() => {
    navigate(AppRouteNames.SETTINGS);
  }, []);

  const onProfilePressHandler = useCallback(() => {
    navigate(AppRouteNames.PROFILE);
  }, []);

  return (
    <View style={[styles.Header, style]}>
      <Pressable onPress={onProfilePressHandler}>
        <Avatar theme={AvatarTheme.SMALL} imageUrl={imageUrl} />
      </Pressable>
      <Pressable onPress={onProfilePressHandler}>
        <View style={styles.nameWrapper}>
          <Text style={styles.title}>{t('home.welcome_back')}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </Pressable>
      <View style={styles.settingsIcon}>
        <Pressable onPress={onSettingsPressHandler}>
          <SvgXml
            fillOpacity={''}
            xml={SettingsIcon}
            style={styles.settingsIcon}
            fill={'#DCDCDC'}
          />
        </Pressable>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(Header);

const styles = StyleSheet.create({
  Header: {
    width: '100%',
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameWrapper: {
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsIcon: {
    marginLeft: 'auto',
    height: 20,
    width: 20,
  },
});
