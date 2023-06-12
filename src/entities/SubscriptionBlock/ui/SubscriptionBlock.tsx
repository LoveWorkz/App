import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {FireIcon} from '@src/shared/assets/icons/FireIcon';
import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientOutline} from '@src/shared/ui/Gradient/GradientOutline';
import {SubscriptionType} from '../model/types/subscriptionTypes';

interface SubscriptionBlockProps {
  subscriptionType: SubscriptionType;
  chosenSubscriptionType?: SubscriptionType;
  setSubscriptionType?: (subscriptionType: SubscriptionType) => void;
}

const SubscriptionBlock = (props: SubscriptionBlockProps) => {
  const {
    subscriptionType,
    chosenSubscriptionType = SubscriptionType.MONTHLY,
    setSubscriptionType,
  } = props;

  const colors = useColors();
  const {theme} = useTheme();
  const isActive = subscriptionType === chosenSubscriptionType;
  const isYearly = SubscriptionType.YEARLY === subscriptionType;

  const onSubscriptionHandler = () => {
    setSubscriptionType?.(subscriptionType);
  };

  return (
    <TouchableOpacity
      onPress={onSubscriptionHandler}
      style={[
        styles.SubscriptionBlock,
        {...getShadowOpacity(theme).shadowOpacity_level_2},
      ]}>
      <View
        style={[
          styles.percentage,
          {backgroundColor: colors.bgQuaternaryColor},
        ]}>
        <SvgXml xml={FireIcon} style={[styles.fireIcon]} />
        <GradientText size={TextSize.LEVEL_2} text={'80% Off'} />
      </View>

      <GradientOutline
        borderWeight={isActive ? 1.5 : 0}
        radius={20}
        style={styles.contentWrapper}
        contentStyle={[
          styles.content,
          {
            ...getShadowOpacity(theme).shadowOpacity_level_2,
            backgroundColor: colors.bgSecondaryColor,
            paddingVertical: verticalScale(isActive ? 8 : 9.5),
            paddingHorizontal: horizontalScale(isActive ? 8 : 9.5),
          },
        ]}>
        <>
          <AppText
            style={styles.title}
            text={isYearly ? 'Yearly' : 'Monthly'}
          />

          <View style={styles.costWrapper}>
            <AppText
              style={[styles.cost, {color: colors.secondaryError}]}
              size={TextSize.LEVEL_4}
              weight={'bold'}
              text={'$1.49'}
            />
            <AppText
              style={styles.discount}
              size={TextSize.LEVEL_3}
              weight={'200'}
              text={'$1.99'}
            />
            <AppText
              style={styles.type}
              size={TextSize.LEVEL_4}
              weight={'bold'}
              text={isYearly ? '/ year' : '/ month'}
            />
          </View>
          <AppText
            style={[{color: colors.purchaseDescriptionColor}]}
            size={TextSize.LEVEL_1}
            text={
              isYearly
                ? 'All categories with no adss + all challenges inside'
                : 'All categories with no adss + bronze, silver and gold challenges'
            }
          />
          <View
            style={[
              styles.billedType,
              {backgroundColor: colors.purchaseButtonColor},
            ]}>
            <AppText
              style={{color: colors.white}}
              size={TextSize.LEVEL_2}
              text={isYearly ? 'Billed yearly' : 'Billed monthly'}
            />
          </View>
        </>
      </GradientOutline>
    </TouchableOpacity>
  );
};

export default memo(SubscriptionBlock);

const styles = StyleSheet.create({
  SubscriptionBlock: {
    width: '46%',
  },
  contentWrapper: {
    minHeight: verticalScale(187),
  },
  fireIcon: {
    height: verticalScale(13),
    width: horizontalScale(12),
    marginRight: horizontalScale(3),
  },
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    position: 'absolute',
    top: verticalScale(-15),
    right: 0,
    height: verticalScale(25),
    width: horizontalScale(76),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...globalStyles.subscriptionPercentageZIndex,
  },
  title: {},
  costWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cost: {},
  type: {},
  discount: {
    textDecorationLine: 'line-through',
  },
  billedType: {
    width: '100%',
    borderRadius: 10,
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
