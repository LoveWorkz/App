import React, {memo} from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';

import {Radio} from '@src/shared/ui/Radio/Radio';

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
  const {changeRubric, rubric, error, initialValue} = props;

  return (
    <SafeAreaView style={styles.rubrics}>
      <Text style={styles.title}>Rubrics</Text>
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
    fontSize: 18,
    marginBottom: 20,
  },
});
