import React, {memo} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Radio} from '@src/shared/ui/Radio/Radio';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {getPreferences} from '../../model/lib/profile';

interface RubricsPropss {
  changeRubric: (rubric: string) => void;
  rubric: string;
  error?: string;
  initialValue?: string;
}

const Preferences = (props: RubricsPropss) => {
  const {t} = useTranslation();
  const colors = useColors();
  const preferences = getPreferences(t);

  const {changeRubric, rubric, error, initialValue} = props;

  return (
    <SafeAreaView style={styles.rubrics}>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        weight={'600'}
        size={TextSize.LEVEL_2}
        text={t('profile.preferences')}
      />
      <Radio
        activeItemStyle={{backgroundColor: colors.primaryTextColor}}
        roundStyle={{borderColor: colors.primaryTextColor}}
        nameStyle={{color: colors.primaryTextColor}}
        style={{color: colors.primaryTextColor}}
        initialValue={initialValue}
        error={error}
        value={rubric}
        data={preferences}
        onChange={changeRubric}
      />
    </SafeAreaView>
  );
};

export default memo(Preferences);

const styles = StyleSheet.create({
  rubrics: {
    width: '100%',
  },
  title: {
    marginBottom: 20,
  },
});
