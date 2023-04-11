import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, Pressable, useWindowDimensions} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {AuthByApple} from '@src/features/authByApple';
import {AuthByEmail, signInStore, signUpStore} from '@src/features/authByEmail';
import {AuthByGoogle} from '@src/features/authByGoogle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Dialog} from '@src/shared/ui/Dialog/Dialog';
import {userStore} from '@src/entities/User';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {isPlatformIos} from '@src/shared/consts/common';
import OrLine from './OrLine/OrLine';

const AuthPage = () => {
  const {t} = useTranslation();
  const {height} = useWindowDimensions();

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
      <OrLine style={styles.line} />
      <View style={styles.btnWrapper}>
        <AuthByGoogle style={styles.authByGoogleBtn} />
        {isPlatformIos && <AuthByApple />}
      </View>
      <View style={styles.bottomBlock}>
        <Button
          disabled={disabled()}
          onPress={auth}
          style={styles.singInBtn}
          theme={ButtonTheme.OUTLINED}>
          <AppText
            style={styles.singInBtnText}
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
                <AppText size={TextSize.LEVEL_4} text={t('auth.signup')} />
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
                <AppText size={TextSize.LEVEL_4} text={t('auth.login')} />
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
  line: {
    marginTop: 30,
    marginBottom: 30,
  },
  titleWrapper: {
    marginTop: 120,
    marginBottom: 40,
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  authByGoogleBtn: {
    marginRight: 20,
  },
  toggleAuthMethod: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singInBtn: {
    backgroundColor: 'black',
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },
  singInBtnText: {
    color: 'white',
  },
  haveEnAccountWrapper: {
    flexDirection: 'row',
  },
  haveEnAccount: {
    marginRight: 5,
  },
});
