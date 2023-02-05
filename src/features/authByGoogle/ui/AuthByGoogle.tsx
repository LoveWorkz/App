import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import authByGoogleStore from '../model/store/authByGoogleStore';
import {GoogleIcon} from '@src/shared/assets/icons/Google';

interface AuthByGoogleProps {
  style?: Record<string, string | number>;
}

export const AuthByGoogle = memo((props: AuthByGoogleProps) => {
  const {style} = props;

  const onHandlePress = useCallback(() => {
    authByGoogleStore.signIn();
  }, []);

  return (
    <View style={[style, styles.authByGoogle]}>
      <Pressable onPress={onHandlePress}>
        <SvgXml xml={GoogleIcon} style={styles.icon} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  authByGoogle: {
    height: 20,
    width: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});
