import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppleIcon} from '@src/shared/assets/icons/Apple';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button} from '@src/shared/ui/Button/Button';
import {horizontalScale, moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import authByAppleStore from '../model/store/authByAppleStore';
import { AppText, TextSize } from '@src/shared/ui/AppText/AppText';
import { t } from 'i18next';

interface AuthByAppleProps {
  style?: Record<string, string | number>;
}

export const AuthByApple = memo((props: AuthByAppleProps) => {
  const {style} = props;
  const colors = useColors();

  const onAppleSingnInHandler = () => {
    authByAppleStore.appleSignIn();
  };

  return (
    <Button style={[styles.btn, {...style, backgroundColor: colors.bgTertiaryColor}]} onPress={onAppleSingnInHandler}>
      <SvgXml
        xml={AppleIcon}
        style={styles.icon}
        fill={colors.bgTabViewColor}
      />
      <AppText
        size={TextSize.LEVEL_4}
        weight={'600'}
        text={t('auth.signup_with_apple')}
        textColor={colors.bgTabViewColor}
      />
    </Button>
  );
});

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: "row",
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    columnGap: 10,
    borderRadius: moderateScale(10)
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});