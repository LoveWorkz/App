import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {getPremiumIcon} from '@src/shared/assets/icons/Premium';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {StyleType} from '@src/shared/types/types';
import {GradientText} from '../GradientText/GradientText';

interface PremiumBlockProps {
  isGradient?: boolean;
  style?: StyleType;
}

const PremiumBlock = (props: PremiumBlockProps) => {
  const {isGradient = false, style} = props;

  const colors = useColors();

  if (isGradient) {
    return (
      <Gradient style={[styles.premiumBlock, {...style}]}>
        <AppText
          style={[styles.premiumText, {color: colors.white}]}
          size={TextSize.LEVEL_2}
          text="Premium"
          weight="500"
        />
        <SvgXml
          xml={getPremiumIcon({isGradient: false})}
          width={horizontalScale(13)}
          height={horizontalScale(13)}
        />
      </Gradient>
    );
  }

  return (
    <View style={[styles.premiumBlock, {backgroundColor: colors.white}, style]}>
      <GradientText size={TextSize.LEVEL_2} text="Premium" />
      <SvgXml
        xml={getPremiumIcon({isGradient: true})}
        width={horizontalScale(13)}
        height={horizontalScale(13)}
      />
    </View>
  );
};

export default memo(PremiumBlock);

const styles = StyleSheet.create({
  premiumBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(6),
    paddingHorizontal: horizontalScale(5),
    paddingVertical: horizontalScale(2),
    alignSelf: 'flex-start',
  },
  premiumText: {
    marginRight: horizontalScale(3),
  },
});
