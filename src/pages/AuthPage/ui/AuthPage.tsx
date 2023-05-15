import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, Pressable, useWindowDimensions} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {AuthByApple} from '@src/features/authByApple';
import {AuthByEmail, signInStore, signUpStore} from '@src/features/authByEmail';
import {AuthByGoogle} from '@src/features/authByGoogle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Dialog} from '@src/shared/ui/Dialog/Dialog';
import {useColors} from '@src/app/providers/colorsProvider';
import {userStore} from '@src/entities/User';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import OrLine from './OrLine/OrLine';

const AuthPage = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {height} = useWindowDimensions();
  const statusBarHeight = getStatusBarHeight();
  const signInTopHeight = isPlatformIos ? 240 : 240 - statusBarHeight;
  const signUpTopHeight = isPlatformIos ? 125 : 125 - statusBarHeight;

  const [isSignIn, setISignIn] = useState(true);

  const toggleSignIn = () => {
    setISignIn(true);
  };

  const toggleSignUp = () => {
    setISignIn(false);
  };

  const actionAfterRegistration = () => {
    setISignIn(true);
  };

  const auth = () => {
    if (isSignIn) {
      signInStore.signIn();
    } else {
      signUpStore.register(actionAfterRegistration);
    }
  };

  const disabled = () => {
    let isDisabled = false;
    const isSignUp = !isSignIn;
    const isLoading = signInStore.isLoading || signUpStore.isLoading;

    if (isSignUp && !signUpStore.agreeWithPrivacyPolicy) {
      isDisabled = true;
    }

    if (isLoading) {
      isDisabled = true;
    }

    return isDisabled;
  };

  const onConfirmHandler = useCallback(() => {
    userStore.toggleDisabledDialog(false);
  }, []);

  return (
    <View style={[styles.container, {height}]}>
      <View style={styles.titleWrapper}>
        <AppText
          size={TextSize.LEVEL_6}
          weight={'600'}
          text={isSignIn ? t('auth.login') : t('auth.signup')}
        />
      </View>
      <AuthByEmail isSingIn={isSignIn} />
      <View style={styles.line}>
        <OrLine />
      </View>
      <View style={styles.btnWrapper}>
        <AuthByGoogle style={isPlatformIos ? styles.authByGoogleBtn : {}} />
        {isPlatformIos && <AuthByApple />}
      </View>
      <View
        style={[
          styles.bottomBlock,
          {
            marginTop: verticalScale(
              isSignIn ? signInTopHeight : signUpTopHeight,
            ),
          },
        ]}>
        <Button
          disabled={disabled()}
          onPress={auth}
          style={styles.singInBtn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={isSignIn ? t('auth.login') : t('auth.signup')}
          />
        </Button>
        <View style={styles.toggleAuthMethod}>
          {isSignIn ? (
            <View style={styles.haveEnAccountWrapper}>
              <AppText
                style={styles.haveEnAccount}
                size={TextSize.LEVEL_4}
                text={t('auth.dont_have_an_acount')}
              />
              <Pressable onPress={isSignIn ? toggleSignUp : toggleSignIn}>
                <GradientText
                  style={styles.changeFormBtn}
                  size={TextSize.LEVEL_4}
                  text={t('auth.signup')}
                />
              </Pressable>
            </View>
          ) : (
            <View style={styles.haveEnAccountWrapper}>
              <AppText
                style={styles.haveEnAccount}
                size={TextSize.LEVEL_4}
                text={t('auth.already_have_an_account')}
              />
              <Pressable onPress={isSignIn ? toggleSignUp : toggleSignIn}>
                <GradientText
                  style={styles.changeFormBtn}
                  size={TextSize.LEVEL_4}
                  text={t('auth.login')}
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {userStore.isDisabledDialogOpen && (
        <Dialog
          visible={userStore.isDisabledDialogOpen}
          confirmText={'OK'}
          onConfirmHandler={onConfirmHandler}
          title={t('auth.disabled_account') || ''}
        />
      )}
    </View>
  );
};

export const ComponentWrapper = memo(observer(AuthPage));

const styles = StyleSheet.create({
  container: {},
  titleWrapper: {
    marginTop: verticalScale(120),
    marginBottom: verticalScale(40),
  },
  line: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(40),
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  authByGoogleBtn: {
    marginRight: horizontalScale(20),
  },
  toggleAuthMethod: {
    marginTop: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  singInBtn: {
    width: '100%',
  },
  bottomBlock: {
    width: '100%',
  },
  haveEnAccountWrapper: {
    flexDirection: 'row',
  },
  haveEnAccount: {
    marginRight: horizontalScale(5),
  },
  changeFormBtn: {
    textDecorationLine: 'underline',
  },
});
