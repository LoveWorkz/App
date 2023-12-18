import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {ChangePasswordIcon} from '@src/shared/assets/icons/ChangePassword';

const ChangePassword = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.CHANGE_PASSWORD);
  }, []);
  ChangePasswordIcon;
  return (
    <Pressable onPress={onPressHandler} style={styles.changePassword}>
      <View style={styles.leftSide}>
        <SvgXml
          stroke={colors.primaryTextColor}
          xml={ChangePasswordIcon}
          style={styles.changePasswordIcon}
        />
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_5}
          text={t('settings.change_password')}
        />
      </View>
      <SvgXml
        stroke={colors.primaryTextColor}
        xml={SmallArrowRightIcon}
        style={styles.icon}
      />
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
  changePasswordIcon: {
    height: horizontalScale(18),
    marginRight: horizontalScale(10),
    width: horizontalScale(18),
    top: verticalScale(2),
  },
  icon: {
    height: horizontalScale(14),
    width: horizontalScale(14),
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
