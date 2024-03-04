import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {Button} from '@src/shared/ui/Button/Button';

interface HaveAnAccountProps {
  onPressHandler: () => void;
  text: string;
  type: string;
}

const HaveAnAccount = (props: HaveAnAccountProps) => {
  const {onPressHandler, text, type} = props;

  return (
    <View style={styles.haveEnAccountWrapper}>
      <AppText size={TextSize.LEVEL_4} text={text} />
      <Button style={styles.btn} onPress={onPressHandler}>
        <GradientText
          style={styles.changeFormBtn}
          size={TextSize.LEVEL_4}
          text={type}
        />
      </Button>
    </View>
  );
};

export default memo(HaveAnAccount);

const styles = StyleSheet.create({
  haveEnAccountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeFormBtn: {
    textDecorationLine: 'underline',
  },
  btn: {
    paddingHorizontal: horizontalScale(8),
  },
});
