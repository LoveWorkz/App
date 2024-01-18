import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

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
  FormattedProductValueType,
  SubscriptionType,
} from '../model/types/subscriptionTypes';

interface SubscriptionBlockProps {
  subscriptionType: SubscriptionType;
  chosenSubscriptionType?: SubscriptionType;
  setSubscriptionType?: (subscriptionType: SubscriptionType) => void;
  productDetails: FormattedProductValueType;
}

const SubscriptionBlock = (props: SubscriptionBlockProps) => {
  const {
    subscriptionType,
    chosenSubscriptionType = SubscriptionType.MONTHLY,
    setSubscriptionType,
    productDetails,
  } = props;

  const {t} = useTranslation();
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
          <View style={styles.titleWrapper}>
            <AppText
              size={TextSize.LEVEL_4}
              text={isYearly ? 'Yearly' : 'Monthly'}
            />
          </View>

          <View style={styles.costWrapper}>
            <AppText
              style={{color: colors.secondaryError}}
              size={TextSize.LEVEL_3}
              weight={'bold'}
              text={productDetails.localisedPrice}
            />
            <View style={styles.costRightWrapper}>
              <AppText
                style={styles.discount}
                size={TextSize.LEVEL_3}
                weight={'200'}
                text={'$1.99'}
              />
              <AppText
                size={TextSize.LEVEL_3}
                weight={'bold'}
                text={isYearly ? ` / ${t('year')}` : ` / ${t('month')}`}
              />
            </View>
          </View>
          <AppText
            style={[{color: colors.purchaseDescriptionColor}]}
            size={TextSize.LEVEL_1}
            text={
              isYearly
                ? `${t('shop.yearly_description')} (${t('only')} 4,99 $/ ${t(
                    'month',
                  )})`
                : t('shop.monthly_description')
            }
          />
        </>
      </GradientOutline>
    </TouchableOpacity>
  );
};

export default memo(SubscriptionBlock);

const styles = StyleSheet.create({
  SubscriptionBlock: {
    width: '47%',
  },
  contentWrapper: {
    minHeight: verticalScale(150),
  },
  costRightWrapper: {
    flexDirection: 'row',
  },
  fireIcon: {
    height: verticalScale(13),
    width: horizontalScale(12),
    marginRight: horizontalScale(3),
  },
  content: {
    alignItems: 'center',
  },
  titleWrapper: {
    marginBottom: verticalScale(6),
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
  costWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: verticalScale(6),
  },
  discount: {
    textDecorationLine: 'line-through',
  },
});
