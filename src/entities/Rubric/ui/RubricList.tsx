import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';

import {Rubric, rubricExample, RubricType} from '@src/entities/Rubric';
import {verticalScale} from '@src/shared/lib/Metrics';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import rubricStore from '../model/store/rubricStore';

interface RubricListProps {
  isLoading: boolean;
}

const RubricList = (props: RubricListProps) => {
  const {isLoading} = props;

  const rubrics = rubricStore.rubrics;

  let content = rubrics.map((rubric, i) => {
    const isFirstElement = i === 0;

    return rubric.questions.length ? (
      <View key={rubric.id} style={isFirstElement ? {} : styles.rubricWrapper}>
        <Rubric rubric={rubric} isLoading={isLoading} />
      </View>
    ) : null;
  });

  if (isLoading) {
    const skeletonRubrics = getEntityExampleDataForSkeleton({
      entity: rubricExample,
      count: 8,
    }) as RubricType[];

    content = skeletonRubrics.map((rubric, i) => {
      const isFirstElement = i === 0;

      return (
        <View
          key={i.toString()}
          style={isFirstElement ? {} : styles.rubricWrapper}>
          <Rubric rubric={rubric} isLoading={isLoading} />
        </View>
      );
    });
  }

  return <>{content}</>;
};

export default memo(observer(RubricList));

const styles = StyleSheet.create({
  rubricWrapper: {
    marginTop: verticalScale(15),
  },
});
