import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Pressable} from 'react-native';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const PrivacyPolicy = () => {
  const {t} = useTranslation();

  const onPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.PRIVACY_POLICY);
  }, []);

  return (
    <Pressable onPress={onPressHandler} style={styles.privacyPolicy}>
      <AppText
        style={styles.privacyPolicyText}
        size={TextSize.LEVEL_4}
        text={t('settings.privacy_policy')}
      />
    </Pressable>
  );
};

export const Wrapper = memo(PrivacyPolicy);

const styles = StyleSheet.create({
  privacyPolicy: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  privacyPolicyText: {
    color: '#009EF6',
    textDecorationLine: 'underline',
  },
});
