import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonTheme, Button} from '../../../shared/ui/Button/Button';

export const AuthByApple = () => {
  return (
    <View style={styles.authByApple}>
      <Button theme={ButtonTheme.OUTLINED}>
        <Text>Continue with Apple</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  authByApple: {},
});
