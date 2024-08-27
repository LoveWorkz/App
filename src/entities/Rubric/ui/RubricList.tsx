import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';

import {Rubric, rubricExample, RubricType} from '@src/entities/Rubric';
import {verticalScale} from '@src/shared/lib/Metrics';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import rubricStore from '../model/store/rubricStore';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

interface RubricListProps {
  isLoading: boolean;
}

const RubricList = (props: RubricListProps) => {
  const {isLoading} = props;
  const lang = useLanguage();
  const rubrics = rubricStore.rubrics;

  const sortedRubrics = rubrics.slice().sort((a, b) => {
    return a.displayName[lang].toLocaleUpperCase() >
      b.displayName[lang].toUpperCase()
      ? 1
      : -1;
  });

  let content = sortedRubrics.map((rubric, i) => {
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
