import React, {memo} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Preference} from '@src/entities/Preference';
import {verticalScale} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {getPreferences} from '../../model/lib/profile';

interface PreferencesPropss {
  changePreference: (preference: string) => void;
  selectedPreferences: string[];
  error?: string;
  isLoading: boolean;
}

const Preferences = (props: PreferencesPropss) => {
  const {t} = useTranslation();
  const colors = useColors();
  const preferences = getPreferences(t);

  const {changePreference, selectedPreferences, error, isLoading} = props;

  if (!selectedPreferences) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.preferences}>
      {isLoading ? (
        <View style={styles.title}>
          <Skeleton width={50} height={13} />
        </View>
      ) : (
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={t('profile.preferences')}
        />
      )}
      {preferences.map(preference => {
        const value = preference.value;
        const isChecked = selectedPreferences.includes(value);

        return (
          <View style={styles.preferenceWrapper} key={value}>
            <Preference
              isLoading={isLoading}
              changePreference={changePreference}
              preference={preference}
              isChecked={isChecked}
            />
          </View>
        );
      })}

      {error && (
        <View>
          <AppText
            weight={'600'}
            size={TextSize.LEVEL_2}
            text={error}
            type={TextType.ERROR}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default memo(Preferences);

const styles = StyleSheet.create({
  preferences: {
    width: '100%',
  },
  title: {
    marginBottom: verticalScale(20),
  },
  preferenceWrapper: {
    marginBottom: verticalScale(20),
  },
});
