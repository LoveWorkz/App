import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Rubric} from '@src/entities/Rubric';

export const rubrics = [
  {
    name: 'Conflict',
    text: 'To get to know each other better',
    id: '1',
    count: 16,
  },
  {
    name: 'FUN',
    text: 'To get to know each other better',
    id: '2',
    count: 24,
  },
  {
    name: 'respect',
    id: '3',
    text: 'To get to know each other better',
    count: 48,
  },
  {
    name: 'Appreciation',
    id: '4',
    text: 'To get to know each other better',
    count: 59,
  },
];

const Rubrics = () => {
  const colors = useColors();

  return (
    <View>
      <AppText
        style={[{color: colors.primaryTextColor}]}
        weight={'500'}
        size={TextSize.LEVEL_5}
        text={'Rubrics'}
      />
      {rubrics.map(rubric => {
        return (
          <View key={rubric.id} style={styles.rubricWrapper}>
            <Rubric rubric={rubric} />
          </View>
        );
      })}
    </View>
  );
};

export default memo(Rubrics);

const styles = StyleSheet.create({
  rubricWrapper: {
    marginTop: 20,
  },
});
