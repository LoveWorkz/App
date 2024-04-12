import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  globalPadding,
  globalStyles,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {InformationIcon} from '@src/shared/assets/icons/Information';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Button} from '@src/shared/ui/Button/Button';
import {QuadrantType} from '../model/types/sessionType';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

interface QuadrantProps {
  isBlocked: boolean;
  quadrant: QuadrantType;
}

const Quadrant = (props: QuadrantProps) => {
  const {isBlocked = false, quadrant} = props;

  const colors = useColors();
  const language = useLanguage();

  const bgColor = isBlocked ? colors.disabledSessionColor : colors.lilacBreeze;

  const onPressHandler = () => {};

  return (
    <View style={[styles.Quadrant, {backgroundColor: bgColor}]}>
      <Button onPress={onPressHandler} style={styles.btn} disabled={isBlocked}>
        <SvgXml
          xml={InformationIcon}
          style={styles.icon}
          stroke={colors.primaryTextColor}
        />
      </Button>

      <AppText
        weight={'500'}
        size={TextSize.LEVEL_2}
        text={quadrant.step[language]}
      />
      <View style={styles.titleWrapper}>
        <AppText
          weight={'900'}
          size={TextSize.LEVEL_6}
          text={quadrant.displayName[language]}
        />
      </View>
      <AppText
        weight={'500'}
        size={TextSize.LEVEL_2}
        text={quadrant.description[language]}
      />
    </View>
  );
};

export default memo(Quadrant);

const paddings = horizontalScale(globalPadding);

const styles = StyleSheet.create({
  Quadrant: {
    padding: paddings,
    width: windowWidth,
    left: -globalPadding,
  },
  titleWrapper: {
    marginVertical: verticalScale(10),
  },
  icon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
  },
  btn: {
    ...globalStyles.zIndex_1,
    position: 'absolute',
    top: paddings,
    right: paddings,
    paddingHorizontal: horizontalScale(10),
  },
});
