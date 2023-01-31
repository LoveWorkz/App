import React, {useCallback, memo} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {Avatar, AvatarTheme} from '@src/shared/ui/Avatar/Avatar';
import {SettingsIcon} from '@src/shared/assets/icons/Settings';

interface HeaderProps {
  style?: Record<string, string | number>;
  imageUrl: string;
  name: string;
}

const Header = (props: HeaderProps) => {
  const {style, imageUrl, name} = props;
  const {t} = useTranslation();

  const onPressHandler = useCallback(() => {
    console.log('press');
  }, []);

  return (
    <View style={[styles.Header, style]}>
      <Avatar theme={AvatarTheme.SMALL} imageUrl={imageUrl} />
      <View style={styles.nameWrapper}>
        <Text style={styles.title}>{t('home.welcome_back')}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.settingsIcon}>
        <Pressable onPress={onPressHandler}>
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
    position: 'absolute',
    top: 0,
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
