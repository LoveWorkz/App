import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {GoogleIcon} from '@src/shared/assets/icons/Google';
import {Button} from '@src/shared/ui/Button/Button';
import {horizontalScale, moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import authByGoogleStore from '../model/store/authByGoogleStore';
import { AppText, TextSize } from '@src/shared/ui/AppText/AppText';
import { t } from 'i18next';
import { useColors } from '@src/app/providers/colorsProvider';

interface AuthByGoogleProps {
  style?: Record<string, string | number>;
}

export const AuthByGoogle = memo((props: AuthByGoogleProps) => {
  const {style} = props;
    const colors = useColors();

  const onHandlePress = useCallback(() => {
    authByGoogleStore.signIn();
  }, []);

  return (
    <Button style={[styles.btn, {...style, backgroundColor: colors.bgTertiaryColor}]} onPress={onHandlePress}>
      <SvgXml xml={GoogleIcon} style={styles.icon} />
      <AppText
        size={TextSize.LEVEL_4}
        weight={'600'}
        text={t('auth.signup_with_google')}
        textColor={colors.bgTabViewColor}
      />
    </Button>
  );
});

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    width: '100%',
    columnGap: 10,
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});