import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Button} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {categoryStore} from '@src/entities/Category';
import {DocumentType} from '@src/shared/types/types';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const BreakHeaderLeft = () => {
  const colors = useColors();

  const onPressHandler = () => {
    const currentLevel = categoryStore.category;
    if (currentLevel) {
      navigation.navigate(AppRouteNames.QUESTIONS, {
        type: DocumentType.CATEGORY,
        id: currentLevel.id,
      });
    }
  };

  return (
    <Button onPress={onPressHandler}>
      <SvgXml fill={colors.white} style={styles.icon} xml={ArrowLeftIcon} />
    </Button>
  );
};

export default memo(BreakHeaderLeft);

const styles = StyleSheet.create({
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
});
