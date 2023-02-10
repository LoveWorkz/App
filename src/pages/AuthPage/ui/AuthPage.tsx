import React, {memo, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {AuthByApple} from '@src/features/authByApple';
import {AuthByEmail, signInStore, signUpStore} from '@src/features/authByEmail';
import {AuthByGoogle} from '@src/features/authByGoogle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import OrLine from './OrLine/OrLine';

const AuthPage = () => {
  const {t} = useTranslation();

  const {height} = useWindowDimensions();

  const [isSignIn, setISignIn] = useState(true);

  const toggleSignIn = useCallback(() => {
    setISignIn(true);
  }, []);

  const toggleSignUp = useCallback(() => {
    setISignIn(false);
  }, []);

  const auth = useCallback(() => {
    if (isSignIn) {
      signInStore.signIn();
    } else {
      signUpStore.register();
    }
  }, [isSignIn]);

  return (
    <ScrollView>
      <View style={[styles.AuthPage, {height}]}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              {isSignIn ? t('auth.login') : t('auth.signup')}
            </Text>
          </View>
          <AuthByEmail isSingIn={isSignIn} />
          <OrLine style={styles.line} />
          <View style={styles.btnWrapper}>
            <AuthByGoogle style={styles.authByGoogleBtn} />
            <AuthByApple />
          </View>
          <View style={styles.bottomBlock}>
            <Button
              disabled={!isSignIn && !signUpStore.agreeWithPrivacyPolicy}
              onPress={auth}
              style={styles.singInBtn}
              theme={ButtonTheme.OUTLINED}>
              <Text style={styles.singInBtnText}>
                {isSignIn ? t('auth.login') : t('auth.signup')}
              </Text>
            </Button>
            <Pressable
              style={styles.toggleAuthMethod}
              onPress={isSignIn ? toggleSignUp : toggleSignIn}>
              {isSignIn ? (
                <Text>{t('auth.dont_have_an_acount')}</Text>
              ) : (
                <Text>{t('auth.already_have_an_account')}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export const ComponentWrapper = memo(observer(AuthPage));

const styles = StyleSheet.create({
  AuthPage: {
    flex: 1,
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  container: {
    position: 'relative',
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 0,
    height: '100%',
  },
  logo: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: 'center',
    marginBottom: 35,
  },
  logoText: {
    fontSize: 25,
  },
  line: {
    marginTop: 20,
    marginBottom: 20,
  },
  titleWrapper: {
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
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
});
