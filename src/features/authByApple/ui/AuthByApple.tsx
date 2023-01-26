import React, {memo} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppleIcon} from '@src/shared/assets/icons/Apple';

interface AuthByAppleProps {
  style?: Record<string, string | number>;
}

export const AuthByApple = memo((props: AuthByAppleProps) => {
  const {style} = props;

  return (
    <View style={[styles.authByApple, style]}>
      <Pressable>
        <SvgXml xml={AppleIcon} style={styles.icon} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  authByApple: {
    height: 20,
    width: 20,
  },
  icon: {
    width: '100%^',
    height: '100%',
  },
});
