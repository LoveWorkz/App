import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {GoogleIcon} from '@src/shared/assets/icons/Google';
import {Button} from '@src/shared/ui/Button/Button';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import authByGoogleStore from '../model/store/authByGoogleStore';

interface AuthByGoogleProps {
  style?: Record<string, string | number>;
}

export const AuthByGoogle = memo((props: AuthByGoogleProps) => {
  const {style} = props;

  const onHandlePress = useCallback(() => {
    authByGoogleStore.signIn();
  }, []);

  return (
    <Button style={[styles.btn, {...style}]} onPress={onHandlePress}>
      <SvgXml xml={GoogleIcon} style={styles.icon} />
    </Button>
  );
});

const styles = StyleSheet.create({
  btn: {
    width: horizontalScale(32),
    height: verticalScale(32),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});
