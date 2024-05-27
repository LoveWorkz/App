import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {discountOfferCardBg} from '@src/shared/assets/images';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {WithInAppPurchase} from '@src/widgets/WithInAppPurchase';
import {inAppPurchaseStore} from '@src/features/InAppPurchase';

interface DiscountOfferCardProps {
  isLoading: boolean;
}

const borderRadius = moderateScale(15);

const DiscountOfferCard = (props: DiscountOfferCardProps) => {
  const {isLoading} = props;

  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  const onPressHandler = () => {
    inAppPurchaseStore.setIsInAppPurchaseModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.DiscountOfferCard}>
        <Skeleton width={'100%'} height={140} borderRadius={borderRadius} />
      </View>
    );
  }

  return (
    <WithInAppPurchase>
      <Gradient style={styles.DiscountOfferCard}>
        <FastImage
          style={styles.image}
          resizeMode={'cover'}
          source={discountOfferCardBg}>
          <View style={styles.discountWrapper}>
            <AppText
              style={[styles.discount, textStyle]}
              weight={'900'}
              size={TextSize.SIZE_68}
              text={'30%'}
            />
            <AppText
              style={[styles.off, textStyle]}
              weight={'900'}
              size={TextSize.SIZE_38}
              text={'OFF'}
            />
          </View>
          <View style={styles.descriptionWrapper}>
            <AppText
              style={textStyle}
              weight={'500'}
              text={'Special offer when you re-subscribe to LoveWorkz Premium'}
              align={'center'}
            />
          </View>

          <Button
            onPress={onPressHandler}
            style={[styles.btn, {backgroundColor: colors.white}]}
            theme={ButtonTheme.OUTLINED}>
            <GradientText
              style={textStyle}
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={'Claim my offer'}
            />
            <SvgXml
              xml={getArrowRightIcon({isGradient: true})}
              style={styles.arrowIcon}
              fill={colors.bgQuinaryColor}
            />
          </Button>
        </FastImage>
      </Gradient>
    </WithInAppPurchase>
  );
};

const padding = horizontalScale(15);
const discountStyles = {
  transform: [{rotate: '-6deg'}],
  textShadowColor: 'rgba(0, 0, 0, 0.40)',
  textShadowOffset: {width: 1, height: 2},
  textShadowRadius: 5,
};

const styles = StyleSheet.create({
  DiscountOfferCard: {
    width: '95%',
    borderRadius,
  },
  image: {
    width: '100%',
    padding,
  },
  discountWrapper: {
    flexDirection: 'row',
    left: horizontalScale(30),
    top: horizontalScale(-18),
  },
  discount: {
    ...discountStyles,
  },
  off: {
    alignSelf: 'flex-end',
    left: horizontalScale(5),
    ...discountStyles,
  },
  descriptionWrapper: {
    marginBottom: horizontalScale(10),
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  arrowIcon: {
    height: horizontalScale(15),
    width: horizontalScale(15),
    marginLeft: horizontalScale(10),
  },
});

export default memo(DiscountOfferCard);
