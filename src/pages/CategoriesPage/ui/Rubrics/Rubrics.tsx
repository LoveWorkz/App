import {View, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Rubric} from '@src/entities/Rubric';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import categoriesStore from '../../model/store/categoriesStore';

const Rubrics = () => {
  const colors = useColors();
  const {t} = useTranslation();
  const rubrics = categoriesStore.rubrics;

  const onRubricPressHandler = (id: string) => {
    navigation.navigate(AppRouteNames.QUESTIONS, {type: 'rubric', id});
  };

  return (
    <View>
      <AppText
        style={[{color: colors.primaryTextColor}]}
        weight={'500'}
        size={TextSize.LEVEL_5}
        text={t('rubrics.title')}
      />
      {rubrics.map(rubric => {
        return rubric.questions.length ? (
          <Pressable
            onPress={() => onRubricPressHandler(rubric.id)}
            key={rubric.id}
            style={styles.rubricWrapper}>
            <Rubric rubric={rubric} />
          </Pressable>
        ) : null;
      })}
    </View>
  );
};

export default memo(observer(Rubrics));

const styles = StyleSheet.create({
  rubricWrapper: {
    marginTop: 20,
  },
});
