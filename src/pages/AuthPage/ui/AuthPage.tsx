import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {windowHeightMinusPaddings} from '@src/app/styles/GlobalStyle';
import {HaveAnAccount} from '@src/widgets/HaveAnAccount';
import OrLine from './OrLine/OrLine';
import {useTheme} from '@src/app/providers/themeProvider';

const AuthPage = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const statusBarHeight = getStatusBarHeight();
  const {isDark} = useTheme();

  const dialogContent = userStore.isAccountDeleted
    ? t('auth.deleted_account')
    : t('auth.disabled_account');

  const [isSignIn, setISignIn] = useState(true);

  const toggleSignIn = useCallback(() => {
    setISignIn(true);
  }, []);

  const toggleSignUp = useCallback(() => {
    setISignIn(false);
  }, []);

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
    userStore.toggleDialog(false);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: windowHeightMinusPaddings - statusBarHeight,
        },
      ]}>
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

      <View style={[styles.bottomBlock]}>
        <Button
          disabled={disabled()}
          onPress={auth}
          style={styles.singInBtn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={isSignIn ? t('auth.login') : t('auth.signup')}
          />
        </Button>
        <View style={styles.toggleAuthMethod}>
          {isSignIn ? (
            <HaveAnAccount
              text={t('auth.dont_have_an_acount')}
              type={t('auth.signup')}
              onPressHandler={isSignIn ? toggleSignUp : toggleSignIn}
            />
          ) : (
            <HaveAnAccount
              text={t('auth.already_have_an_account')}
              type={t('auth.login')}
              onPressHandler={isSignIn ? toggleSignUp : toggleSignIn}
            />
          )}
        </View>
      </View>
      {userStore.isDialogOpen && (
        <Dialog
          visible={userStore.isDialogOpen}
          confirmText={t('common.ok')}
          onConfirmHandler={onConfirmHandler}
          title={dialogContent || ''}
        />
      )}
    </View>
  );
};

export const ComponentWrapper = memo(observer(AuthPage));

const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(140),
    paddingTop: verticalScale(100),
  },
  titleWrapper: {
    marginBottom: verticalScale(40),
  },
  line: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(35),
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
    position: 'absolute',
    bottom: verticalScale(isPlatformIos ? 10 : 25),
  },
});
