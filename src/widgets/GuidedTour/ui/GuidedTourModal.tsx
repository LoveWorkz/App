import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useCopilot} from 'react-native-copilot';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import guidedTourStore from '../model/store/guidedTourStore';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';

const GuidedTourModal = () => {
  const {currentStep, isLastStep, goToNext, stop} = useCopilot();
  const colors = useColors();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  if (!currentStep) {
    return null;
  }

  const onFinishHandler = () => {
    stop();
    guidedTourStore.handleGuidedTourCompleteLogic();
  };

  const isOrderSetting = currentStep.order === 4;
  const isOrderQuadrant = currentStep.order === 2;

  let arrowStyleName = 'arrowBottomLeft';

  switch (currentStep.order) {
    case 1:
      arrowStyleName = 'arrowTop';
      break;
    case 2:
      arrowStyleName = 'arrowTopRight';
      break;
    case 3:
      arrowStyleName = 'arrowBottomLeft';
      break;
    default:
      arrowStyleName = 'arrowTopRight';
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
      ]}>
      <View style={styles.title}>
        <AppText
          size={TextSize.LEVEL_5}
          weight={'700'}
          text={currentStep.name}
          lineHeight={25}
          align={'center'}
        />
      </View>
      <AppText
        weight="300"
        align={'center'}
        size={TextSize.LEVEL_4}
        text={currentStep.text}
      />
      {isOrderSetting && (
        <View style={styles.settingDescription}>
          <AppText
            weight="300"
            align={'center'}
            letterSpacing={1}
            size={TextSize.LEVEL_4}
            text={t('common.few_clicks_away')}
          />
        </View>
      )}
      {isOrderQuadrant && (
        <View style={styles.settingDescription}>
          <AppText
            weight="600"
            align={'center'}
            size={TextSize.LEVEL_2}
            text={t('common.how_to_use_quadrants')}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={isLastStep ? onFinishHandler : goToNext}
          theme={ButtonTheme.GRADIENT}
          style={styles.btn}>
          <AppText
            style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
            size={TextSize.LEVEL_5}
            weight={'600'}
            text={isLastStep ? t('common.got_it_lets_do_it') : t('common.next')}
          />
        </Button>
      </View>
      <View
        style={[
          styles.arrow,
          styles[arrowStyleName],
          {borderBottomColor: isDark ? colors.bgTertiaryColor : colors.white},
          {borderTopColor: isDark ? colors.bgTertiaryColor : colors.white},
        ]}
      />
    </View>
  );
};

const arrowSize = horizontalScale(10);

const arrrowTopStyles = {
  top: -arrowSize,
  borderBottomWidth: arrowSize,
};

const styles = StyleSheet.create<any>({
  container: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(18),
    alignItems: 'center',
    borderRadius: moderateScale(15),
    width: windowWidthMinusPaddings,
    left: horizontalScale(-8),
  },
  title: {
    marginBottom: verticalScale(10),
  },
  buttonContainer: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  btn: {
    width: '100%',
  },

  settingDescription: {
    marginTop: verticalScale(15),
  },

  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: arrowSize,
    borderRightWidth: arrowSize,
  },
  arrowTop: {
    left: '50%',
    transform: [{translateX: arrowSize}],
    ...arrrowTopStyles,
  },
  arrowTopRight: {
    right: horizontalScale(15),
    ...arrrowTopStyles,
  },
  arrowBottomLeft: {
    bottom: -arrowSize,
    left: horizontalScale(15),
    borderTopWidth: arrowSize,
    // borderTopColor: 'white',
  },
});

export default memo(GuidedTourModal);
