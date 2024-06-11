import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {FireIcon} from '@src/shared/assets/icons/FireIcon';
import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientOutline} from '@src/shared/ui/Gradient/GradientOutline';
import {
  SubscriptionBlockContentType,
  SubscriptionType,
} from '../model/types/subscriptionTypes';

interface SubscriptionBlockProps {
  chosenSubscriptionType?: SubscriptionType;
  setSubscriptionType?: (subscriptionType: SubscriptionType) => void;
  subscriptionBlockContent: SubscriptionBlockContentType;
  isPromo: boolean;
}

const SubscriptionBlock = (props: SubscriptionBlockProps) => {
  const {
    chosenSubscriptionType = SubscriptionType.YEARLY,
    setSubscriptionType,
    subscriptionBlockContent,
    isPromo,
  } = props;

  const colors = useColors();
  const {theme} = useTheme();

  const {
    description,
    duration,
    cost,
    promoCost,
    subscriptionType,
    perWeekCost,
  } = subscriptionBlockContent;

  const isActive = subscriptionType === chosenSubscriptionType;
  const isYearly = SubscriptionType.YEARLY === subscriptionType;
  const textColor = isActive ? colors.white : colors.primaryTextColor;

  const onSubscriptionHandler = () => {
    setSubscriptionType?.(subscriptionType);
  };

  return (
    <TouchableOpacity
      onPress={onSubscriptionHandler}
      style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      {isYearly && (
        <Gradient
          style={[
            styles.percentage,
            {backgroundColor: colors.bgQuaternaryColor},
          ]}>
          <SvgXml xml={FireIcon} style={[styles.fireIcon]} />
          <AppText
            style={{color: colors.white}}
            size={TextSize.LEVEL_2}
            text={'Popular'}
          />
        </Gradient>
      )}

      <GradientOutline
        borderWeight={1.5}
        radius={moderateScale(15)}
        style={styles.contentWrapper}
        contentStyle={[
          {
            ...getShadowOpacity(
              theme,
              isActive ? 'transparent' : colors.bgSecondaryColor,
            ).shadowOpacity_level_2,
            backgroundColor: isActive ? 'transparent' : colors.bgSecondaryColor,
          },
        ]}>
        <View style={styles.content}>
          <View style={styles.leftSide}>
            <AppText
              size={TextSize.LEVEL_6}
              text={duration}
              weight={'700'}
              style={[styles.subscriptionPeriod, {color: textColor}]}
            />
            <AppText
              style={{color: textColor}}
              size={TextSize.LEVEL_2}
              text={description}
            />
          </View>
          <View>
            <View style={styles.costWrapper}>
              {isPromo ? (
                <>
                  <AppText
                    style={[styles.mainCost, {color: textColor}]}
                    size={TextSize.LEVEL_4}
                    text={cost}
                    weight={'400'}
                  />
                  <AppText
                    style={{color: textColor}}
                    weight={'600'}
                    size={TextSize.LEVEL_6}
                    text={promoCost}
                  />
                </>
              ) : (
                <AppText
                  style={{color: textColor}}
                  weight={'600'}
                  size={TextSize.LEVEL_6}
                  text={cost}
                />
              )}
            </View>
            <View style={styles.perWeekWrapper}>
              <AppText
                style={[styles.perWeekCost, {color: textColor}]}
                size={TextSize.LEVEL_3}
                text={perWeekCost}
                weight={'500'}
              />
              <AppText
                style={{color: textColor}}
                weight={'500'}
                size={TextSize.LEVEL_3}
                text={'per week'}
              />
            </View>
          </View>
        </View>
      </GradientOutline>
    </TouchableOpacity>
  );
};

export default memo(SubscriptionBlock);

const marginBottom = verticalScale(6);

const styles = StyleSheet.create({
  contentWrapper: {
    minHeight: verticalScale(110),
  },
  leftSide: {
    width: '55%',
  },
  subscriptionPeriod: {
    marginBottom: marginBottom,
  },
  fireIcon: {
    height: verticalScale(13),
    width: horizontalScale(12),
    marginRight: horizontalScale(3),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: horizontalScale(20),
  },
  percentage: {
    position: 'absolute',
    top: verticalScale(-15),
    right: horizontalScale(20),
    height: verticalScale(25),
    width: horizontalScale(76),
    borderRadius: moderateScale(5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...globalStyles.subscriptionPercentageZIndex,
  },
  costWrapper: {
    flexDirection: 'row',
    marginBottom: marginBottom,
  },
  mainCost: {
    right: horizontalScale(5),
    textDecorationLine: 'line-through',
  },
  perWeekWrapper: {
    marginLeft: 'auto',
  },
  perWeekCost: {
    marginLeft: 'auto',
  },
});
