import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {ArranKennedy} from '@src/shared/assets/images';

const TherapistBlock = () => {
  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.black};
  }, []);

  return (
    <View style={[styles.TherapistBlock, {backgroundColor: colors.white}]}>
      <View style={styles.topBlock}>
        <View style={styles.avatarWrapper}>
          <Avatar size={60} imageNumber={ArranKennedy} />
        </View>
        <AppText weight="900" size={TextSize.LEVEL_5} text={'Arran Kennedy'} />
      </View>
      <View style={styles.text}>
        <AppText style={textStyle} size={TextSize.LEVEL_4} text={'Nice Job,'} />
      </View>

      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={
            'Take a little break and talk about what you liked and disliked about the question part.'
          }
        />
      </View>
      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={
            'The upcoming challenge part is like a homework for you two. You may repeat them as how often you want.'
          }
        />
      </View>
    </View>
  );
};

export default memo(TherapistBlock);

const styles = StyleSheet.create({
  TherapistBlock: {
    width: '100%',
    borderRadius: moderateScale(20),
    padding: horizontalScale(46),
  },
  topBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: horizontalScale(10),
  },
  text: {
    marginTop: verticalScale(20),
  },
});
