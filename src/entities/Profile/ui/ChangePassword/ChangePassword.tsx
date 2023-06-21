import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';

const ChangePassword = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.CHANGE_PASSWORD);
  }, []);

  return (
    <Pressable onPress={onPressHandler} style={styles.changePassword}>
      <View>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_5}
          text={t('settings.change_password')}
        />
      </View>
      <View>
        <SvgXml
          stroke={colors.primaryTextColor}
          xml={SmallArrowRightIcon}
          style={styles.icon}
        />
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
    height: horizontalScale(16),
    width: horizontalScale(16),
  },
});
