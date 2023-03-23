import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const ChangePassword = () => {
  const {t} = useTranslation();

  const onPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.CHANGE_PASSWORD);
  }, []);

  return (
    <Pressable onPress={onPressHandler} style={styles.changePassword}>
      <View>
        <AppText size={TextSize.LEVEL_5} text={t('settings.change_password')} />
      </View>
      <View>
        <SvgXml xml={SmallArrowRightIcon} style={styles.icon} />
        <View />
      </View>
    </Pressable>
  );
};

export const Wrapper = memo(ChangePassword);

const styles = StyleSheet.create({
  changePassword: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    height: 16,
    width: 16,
  },
});
