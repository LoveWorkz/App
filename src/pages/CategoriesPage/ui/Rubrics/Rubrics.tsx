import {View, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Rubric, rubricExample, RubricType} from '@src/entities/Rubric';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {verticalScale} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {getInformationBlockContent} from '@src/widgets/InformationBlock';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import categoriesStore from '../../model/store/categoriesStore';

interface RubricsProps {
  isLoading: boolean;
}

const Rubrics = (props: RubricsProps) => {
  const {isLoading} = props;

  const colors = useColors();
  const {t} = useTranslation();
  let rubrics = categoriesStore.rubrics;

  const informationBlockContent = getInformationBlockContent('Rubrics');

  if (isLoading) {
    rubrics = getEntityExampleDataForSkeleton({
      entity: rubricExample,
      count: 3,
    }) as RubricType[];
  }

  const onRubricPressHandler = (id: string) => {
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.RUBRIC,
      id,
    });
  };

  return (
    <View>
      {isLoading ? (
        <View>
          <Skeleton width={100} height={18} />
        </View>
      ) : (
        <View style={styles.titleWrapper}>
          <AppText
            style={[{color: colors.primaryTextColor}]}
            weight={'500'}
            size={TextSize.LEVEL_5}
            text={t('rubrics.title')}
          />
          <View>
            <InformationBlock
              title={informationBlockContent.title}
              text={informationBlockContent.text}
            />
          </View>
        </View>
      )}
      {rubrics.map(rubric => {
        return rubric.questions.length ? (
          <Pressable
            onPress={() => onRubricPressHandler(rubric.id)}
            key={rubric.id}
            style={styles.rubricWrapper}>
            <Rubric rubric={rubric} isLoading={isLoading} />
          </Pressable>
        ) : null;
      })}
    </View>
  );
};

export default memo(observer(Rubrics));

const styles = StyleSheet.create({
  rubricWrapper: {
    marginTop: verticalScale(20),
  },
  titleWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
