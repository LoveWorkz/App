import React, { memo } from 'react';
import {StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {AppText, TextSize} from '../AppText/AppText';
import {Button, ButtonTheme} from '../Button/Button';

interface GradientArrowButtonProps {
  onPressHandler: () => void;
  text: string;
}

export const GradientArrowButton = memo((props: GradientArrowButtonProps) => {
  const {onPressHandler, text} = props;
  const colors = useColors();

  return (
    <Button
      onPress={onPressHandler}
      style={styles.btn}
      theme={ButtonTheme.GRADIENT}>
      <AppText
        style={{color: colors.white}}
        size={TextSize.LEVEL_4}
        weight={'700'}
        text={text}
      />
      <SvgXml
        xml={getArrowRightIcon({})}
        fill={colors.white}
        style={styles.icon}
      />
    </Button>
  );
});

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    width: horizontalScale(13),
    height: horizontalScale(13),
    marginLeft: horizontalScale(10),
    top: verticalScale(2),
  },
});
