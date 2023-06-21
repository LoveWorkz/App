import React, {memo, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import signUpStore from '../model/store/SignUpStore';

const SignUp = () => {
  const {t} = useTranslation();
  const colors = useColors();

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
    navigation.navigate(AppRouteNames.PRIVACY_POLICY);
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
          placeholder={t('auth.enter_password') || ''}
        />
        {signUpStore.errorInfo.passwordError && (
          <AppText
            size={TextSize.LEVEL_1}
            weight={'500'}
            type={TextType.ERROR}
            text={signUpStore.errorInfo.passwordError}
          />
        )}
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
        <View style={styles.checkbox}>
          <CustomCheckBox
            checked={signUpStore.agreeWithPrivacyPolicy}
            onChange={onCheckboxChangeHandler}
          />
        </View>

        <View style={styles.privacyPolicyTextWrapper}>
          <AppText
            size={TextSize.LEVEL_3}
            style={[
              styles.privacyPolicyText,
              {color: colors.authPageAgreementText},
            ]}
            text={t('auth.agree_with')}
          />
          <Pressable onPress={onPrivacyPolicyPressHandler}>
            <AppText
              size={TextSize.LEVEL_3}
              style={{color: colors.primaryTextColor}}
              text={t('auth.terms_of_policy')}
            />
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
    marginBottom: verticalScale(15),
    marginTop: verticalScale(15),
  },
  privacyPolicy: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: horizontalScale(8),
  },
  privacyPolicyTextWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  privacyPolicyText: {
    marginRight: horizontalScale(5),
  },
});
