import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ButtonTheme, Button} from '../../../../../shared/ui/Button/Button';
import {Input} from '../../../../../shared/ui/Input/Input';

export const SignUp = memo(() => {
  return (
    <View style={styles.SignUP}>
      <View style={styles.password}>
        <Text style={styles.emailText}>Email</Text>
        <Input placeholder={'Enter Email'} />
      </View>
      <View>
        <Text style={styles.passwordText}>UserName</Text>
        <Input placeholder={'Enter Password'} />
      </View>
      <View style={styles.password}>
        <Text style={styles.emailText}>Password</Text>
        <Input placeholder={'Enter Email'} />
      </View>
      <View>
        <Text style={styles.passwordText}>Repeat Password</Text>
        <Input placeholder={'Repeat Password'} />
      </View>
      <Button style={styles.singInBtn} theme={ButtonTheme.OUTLINED}>
        <Text style={styles.singInBtnText}>Sing up</Text>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  SignUP: {
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
