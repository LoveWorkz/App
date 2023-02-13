import React, {memo, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import CheckBox from '@react-native-community/checkbox';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import signUpStore from '../model/store/SignUpStore';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const SignUp = () => {
  const {t} = useTranslation();

  useEffect(() => {
    return () => signUpStore.resetForm();
  }, []);

  const onEmailChangeHandler = useCallback((email: string) => {
    signUpStore.setEmail(email);
  }, []);

  const onPasswordChangeHandler = useCallback((password: string) => {
    signUpStore.setPassword(password);
  }, []);

  const onConfirmPasswordChangeHandler = useCallback((password: string) => {
    signUpStore.setConfirmPassword(password);
  }, []);

  const onCheckboxChangeHandler = useCallback((isAgree: boolean) => {
    signUpStore.setAgreeWithPrivacyPolicy(isAgree);
  }, []);

  const onPrivacyPolicyPressHandler = useCallback(() => {
    navigate(AppRouteNames.PRIVACY_POLICY);
  }, []);

  return (
    <View>
      <View>
        <Input
          label={t('auth.email') || ''}
          value={signUpStore.signUpData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email') || ''}
          error={signUpStore.errorInfo.emailError}
        />
      </View>
      <View style={styles.password}>
        <Input
          secureTextEntry
          label={t('auth.password') || ''}
          value={signUpStore.signUpData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
          error={signUpStore.errorInfo.passwordError}
        />
      </View>
      <View>
        <Input
          secureTextEntry
          label={t('auth.repeat_password') || ''}
          value={signUpStore.signUpData.confirmPassword}
          onChange={onConfirmPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
          error={signUpStore.errorInfo.confirmPasswordError}
        />
      </View>
      <View style={styles.privacyPolicy}>
        <CheckBox
          value={signUpStore.agreeWithPrivacyPolicy}
          onValueChange={onCheckboxChangeHandler}
          style={styles.checkbox}
        />
        <View style={styles.privacyPolicyTextWrapper}>
          <Text style={styles.privacyPolicyText}>I agree with the</Text>
          <Pressable onPress={onPrivacyPolicyPressHandler}>
            <Text style={styles.privacyPolicyLink}>
              Terms of Use & Privacy Policy
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(SignUp));

const styles = StyleSheet.create({
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginBottom: 15,
    marginTop: 15,
  },
  privacyPolicy: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {},
  privacyPolicyTextWrapper: {
    flexDirection: 'row',
  },
  privacyPolicyText: {
    color: '#9A9AA5',
    marginRight: 5,
  },
  privacyPolicyLink: {
    color: 'black',
  },
});
