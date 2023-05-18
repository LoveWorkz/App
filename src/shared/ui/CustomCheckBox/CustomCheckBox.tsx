import React, {memo} from 'react';
import {SvgXml} from 'react-native-svg';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {CheckIcon} from '@src/shared/assets/icons/Check';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '../Gradient/Gradient';
import {GradientOutline} from '../Gradient/GradientOutline';

interface Checkbox {
  checked: boolean;
  onChange?: (newValue: boolean) => void;
}

const CustomCheckBox = memo((props: Checkbox) => {
  const {checked = true, onChange} = props;
  const colors = useColors();

  const onPressHandler = () => {
    onChange?.(!checked);
  };

  return (
    <TouchableOpacity onPress={onPressHandler}>
      {checked ? (
        <Gradient style={[styles.checkBox, styles.checked]}>
          <SvgXml
            xml={CheckIcon}
            stroke={colors.bgQuinaryColor}
            style={styles.icon}
          />
        </Gradient>
      ) : (
        <GradientOutline
          borderWeight={1}
          radius={5}
          style={[styles.checkBox]}
          contentStyle={[styles.space, {backgroundColor: colors.bgColor}]}
        />
      )}
    </TouchableOpacity>
  );
});

export default CustomCheckBox;

const styles = StyleSheet.create({
  checkBox: {
    borderRadius: moderateScale(5),
    width: horizontalScale(20),
    height: horizontalScale(20),
  },
  checked: {justifyContent: 'center', alignItems: 'center'},
  icon: {
    width: horizontalScale(15),
    height: verticalScale(10),
  },
  space: {
    borderRadius: moderateScale(3),
    marginHorizontal: horizontalScale(2),
    marginVertical: verticalScale(2),
    justifyContent: 'center',
  },
});
