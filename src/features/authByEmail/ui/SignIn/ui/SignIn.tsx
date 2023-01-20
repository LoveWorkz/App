import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonTheme, Button} from '../../../../../shared/ui/Button/Button';
import {Input} from '../../../../../shared/ui/Input/Input';

export const SignIn = memo(() => {
  return (
    <View style={styles.SignIn}>
      <View style={styles.password}>
        <Text style={styles.emailText}>Email</Text>
        <Input placeholder={'Enter Email'} />
      </View>
      <View>
        <Text style={styles.passwordText}>Password</Text>
        <Input placeholder={'Enter Password'} />
      </View>
      <Button style={styles.singInBtn} theme={ButtonTheme.OUTLINED}>
        <Text style={styles.singInBtnText}>Sing in</Text>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  SignIn: {
    marginTop: 20,
    height: 350,
  },
  emailText: {
    fontWeight: '600',
  },
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginBottom: 10,
    marginTop: 10,
  },
  singInBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'black',
  },
  singInBtnText: {
    color: 'white',
  },
});
