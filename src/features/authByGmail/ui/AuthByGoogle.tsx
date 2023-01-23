import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ButtonTheme, Button} from '@src/shared/ui/Button/Button';
import authByGoogleStore from '../model/store/authByGoogleStore';

interface AuthByGoogleProps {
  style: Record<string, string | number>;
}

export const AuthByGoogle = memo((props: AuthByGoogleProps) => {
  const {style} = props;

  const onHandlePress = useCallback(() => {
    authByGoogleStore.signIn();
  }, []);

  return (
    <View style={[style, styles.authByGoogle]}>
      <Button onPress={onHandlePress} theme={ButtonTheme.OUTLINED}>
        <Text>Continue with Google</Text>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  authByGoogle: {},
});
