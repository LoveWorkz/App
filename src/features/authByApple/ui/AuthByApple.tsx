import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppleIcon} from '@src/shared/assets/icons/Apple';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button} from '@src/shared/ui/Button/Button';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import authByAppleStore from '../model/store/authByAppleStore';

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
    <Button style={[styles.btn, {...style}]} onPress={onAppleSingnInHandler}>
      <SvgXml
        xml={AppleIcon}
        style={styles.icon}
        fill={colors.appleIconColor}
      />
    </Button>
  );
});

const styles = StyleSheet.create({
  btn: {
    width: horizontalScale(32),
    height: verticalScale(32),
  },
  icon: {
    width: '100%^',
    height: '100%',
  },
});
