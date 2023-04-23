import React, {memo} from 'react';
import {SvgXml} from 'react-native-svg';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {CheckIcon} from '@src/shared/assets/icons/Check';
import {Gradient} from '../Gradient/Gradient';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';

interface Checkbox {
  checked: boolean;
  onChange?: (newValue: boolean) => void;
}

const CustomCheckBox = memo((props: Checkbox) => {
  const {checked = true, onChange} = props;

  const onPressHandler = () => {
    onChange?.(!checked);
  };

  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.checkBox}>
      {checked ? (
        <Gradient
          style={[
            styles.SubChallenge,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <SvgXml xml={CheckIcon} stroke={'white'} style={styles.icon} />
        </Gradient>
      ) : (
        <Gradient style={[styles.SubChallenge]}>
          <View style={styles.space} />
        </Gradient>
      )}
    </TouchableOpacity>
  );
});

export default CustomCheckBox;

const styles = StyleSheet.create({
  checkBox: {},
  SubChallenge: {
    borderRadius: moderateScale(5),
    width: horizontalScale(20),
    height: verticalScale(20),
  },
  icon: {
    width: horizontalScale(15),
    height: verticalScale(10),
  },
  space: {
    borderRadius: moderateScale(3),
    flex: 1,
    marginHorizontal: horizontalScale(2),
    marginVertical: verticalScale(2),
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
