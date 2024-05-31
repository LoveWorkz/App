import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {CheckIcon} from '@src/shared/assets/icons/Check';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';

const BenefitList = () => {
  const colors = useColors();

  const data = [
    'Premium content for you and your partner',
    'All therapeutic sessions from our experts.',
    '1200+ Questions, Routines, Exercises & much more',
    'more than 80 weeks of intensive relationship work',
    'Therapeutic tips from our experts',
  ];

  return (
    <>
      {data.map(item => {
        return (
          <View style={styles.row} key={item}>
            <Gradient style={styles.round}>
              <SvgXml
                xml={CheckIcon}
                stroke={colors.bgQuinaryColor}
                style={styles.icon}
              />
            </Gradient>
            <AppText size={TextSize.LEVEL_2} text={item} weight={'600'} />
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  round: {
    width: horizontalScale(20),
    height: horizontalScale(20),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(10),
  },
  icon: {
    width: horizontalScale(14),
    height: verticalScale(10),
  },
});

export default memo(BenefitList);
