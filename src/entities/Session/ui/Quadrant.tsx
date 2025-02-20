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
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import PremiumBlock from '@src/shared/ui/PremiumBlock/PremiumBlock';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {QuadrantType} from '../model/types/sessionType';
import {useTheme} from '@src/app/providers/themeProvider';

interface QuadrantProps {
  isBlocked: boolean;
  quadrant: QuadrantType;
  isPremium: boolean;
}

const Quadrant = (props: QuadrantProps) => {
  const {isBlocked = false, quadrant, isPremium} = props;

  const colors = useColors();
  const {isDark} = useTheme();
  const language = useLanguage();

  const disabled = isBlocked || isPremium;

  const regularBgColors =isDark ? colors.bgSessionActive : colors.bgSessionPassive;
  const bgColor = regularBgColors;

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.QUADRANT_DETAILS, {id: quadrant.id});
  };

  console.log('QUADRANT DETAILS PAGE');

  return (
    <View style={[styles.Quadrant, {backgroundColor: bgColor}]}>
      <Button onPress={onPressHandler} style={styles.btn} disabled={disabled}>
        <SvgXml
          xml={InformationIcon}
          style={styles.icon}
          stroke={colors.primaryTextColor}
        />
      </Button>

      <View style={styles.stepWrapper}>
        {disabled && <SvgXml xml={LockIcon} style={styles.lockIcon} />}

        <AppText
          weight={'700'}
          size={TextSize.LEVEL_3}
          text={quadrant.step?.[language]}
        />
        {isPremium && (
          <View style={styles.premiumBlock}>
            <PremiumBlock isGradient />
          </View>
        )}
      </View>
      <View style={styles.titleWrapper}>
        <AppText
          weight={'700'}
          size={TextSize.LEVEL_6}
          text={quadrant.displayName?.[language]}
        />
      </View>
      <AppText
        weight={'400'}
        size={TextSize.LEVEL_4}
        text={quadrant.description?.[language]}
      />
    </View>
  );
};

export default memo(Quadrant);

const paddings = horizontalScale(globalPadding);
const iconPosition = paddings - 10;

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
    top: iconPosition,
    right: iconPosition,
    paddingHorizontal: horizontalScale(10),
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBlock: {
    marginLeft: horizontalScale(10),
  },
  lockIcon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
    marginRight: horizontalScale(6),
  },
});
