import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {FireIcon} from '@src/shared/assets/icons/FireIcon';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';

interface SubscriptionBlockProps {
  isActive?: boolean;
  isYearly?: boolean;
}

const SubscriptionBlock = (props: SubscriptionBlockProps) => {
  const {isActive = false, isYearly = false} = props;
  const colors = useColors();
  const {theme} = useTheme();

  return (
    <View
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
      <Gradient style={styles.contentWrapper}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.bgSecondaryColor,
              margin: isActive ? 1.5 : 0,
            },
          ]}>
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
            style={[
              styles.description,
              {color: colors.purchaseDescriptionColor},
            ]}
            size={TextSize.LEVEL_1}
            text={
              isYearly
                ? 'All categories with no adss + all challenges inside'
                : 'All categories with no adss + bronze, silver and gold challenges'
            }
          />
          <Button
            style={[styles.btn, {backgroundColor: colors.purchaseButtonColor}]}
            theme={ButtonTheme.CLEAR}>
            <AppText
              style={{color: colors.white}}
              size={TextSize.LEVEL_2}
              text={isYearly ? 'Billed yearly' : 'Billed monthly'}
            />
          </Button>
        </View>
      </Gradient>
    </View>
  );
};

export default memo(SubscriptionBlock);

const styles = StyleSheet.create({
  SubscriptionBlock: {
    width: '46%',
  },
  contentWrapper: {
    minHeight: 187,
    borderRadius: 20,
    zIndex: 1,
  },
  fireIcon: {
    height: verticalScale(13),
    width: horizontalScale(12),
    marginRight: horizontalScale(3),
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 1,
  },
  percentage: {
    position: 'absolute',
    top: verticalScale(-15),
    right: 0,
    height: verticalScale(25),
    width: horizontalScale(76),
    borderRadius: moderateScale(10),
    zIndex: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  description: {},
  btn: {
    width: '100%',
    borderRadius: 10,
  },
});
