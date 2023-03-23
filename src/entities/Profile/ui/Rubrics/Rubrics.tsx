import React, {memo} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Radio} from '@src/shared/ui/Radio/Radio';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const rubrics = [
  'I am here just for fun',
  'Increase our intimacy level',
  'Increase appreciation and respect',
  'Conflict management',
  'Communication',
  'Self - reflection',
];

interface RubricsPropss {
  changeRubric: (rubric: string) => void;
  rubric: string;
  error?: string;
  initialValue?: string;
}

const Rubrics = (props: RubricsPropss) => {
  const {t} = useTranslation();

  const {changeRubric, rubric, error, initialValue} = props;

  return (
    <SafeAreaView style={styles.rubrics}>
      <AppText
        style={styles.title}
        weight={'600'}
        size={TextSize.LEVEL_2}
        text={t('rubrics.title')}
      />
      <Radio
        initialValue={initialValue}
        error={error}
        value={rubric}
        data={rubrics}
        onChange={changeRubric}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(Rubrics);

const styles = StyleSheet.create({
  rubrics: {
    width: '100%',
  },
  title: {
    marginBottom: 20,
  },
});
