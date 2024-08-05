import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useTranslation} from 'react-i18next';

const PrivacyPolicyPage = () => {
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <View style={styles.privacyPolicy}>
      <AppText
        style={[styles.text, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('common.privacy_policy_text')}
      />
    </View>
  );
};

export const Wrapper = memo(PrivacyPolicyPage);

const styles = StyleSheet.create({
  privacyPolicy: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    textAlign: 'left',
  },
});
