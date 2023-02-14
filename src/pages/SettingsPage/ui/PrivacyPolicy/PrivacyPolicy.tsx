import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, Pressable} from 'react-native';

import {navigation} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const PrivacyPolicy = () => {
  const {t} = useTranslation();

  const onPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.PRIVACY_POLICY);
  }, []);

  return (
    <Pressable onPress={onPressHandler} style={styles.privacyPolicy}>
      <Text style={styles.privacyPolicyText}>
        {t('settings.privacy_policy')}
      </Text>
    </Pressable>
  );
};

export const Wrapper = memo(PrivacyPolicy);

const styles = StyleSheet.create({
  privacyPolicy: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  privacyPolicyText: {
    fontSize: 18,
    color: '#009EF6',
    borderBottomColor: '#009EF6',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
});
