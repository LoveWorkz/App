import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import ChallengeDescription from '../ChallengeDescription/ChallengeDescription';

const Item = ({title, index}: {title: string; index: number}) => {
  return (
    <View
      style={[styles.item, {marginTop: verticalScale(index === 0 ? 0 : 6)}]}>
      <Text style={styles.bulletPoint}>•</Text>
      <View style={styles.title}>
        <ChallengeDescription gradientWordscount={1} description={title} />
      </View>
    </View>
  );
};

interface ChallengeDescriptionListProps {
  gradientWordscount?: number;
  isMarginBottom?: boolean;
  list: Array<{description: string}>;
}

const ChallengeDescriptionList = (props: ChallengeDescriptionListProps) => {
  const {isMarginBottom, list} = props;

  return (
    <View
      style={[
        styles.ChallengeDescriptionList,
        {marginBottom: isMarginBottom ? verticalScale(10) : 'auto'},
      ]}>
      {list.map((item, i) => {
        return (
          <Item key={item.description} title={item.description} index={i} />
        );
      })}
    </View>
  );
};

export default memo(ChallengeDescriptionList);

export const styles = StyleSheet.create({
  ChallengeDescriptionList: {
    paddingLeft: horizontalScale(5),
  },
  item: {
    flexDirection: 'row',
  },
  title: {
    marginLeft: horizontalScale(6),
  },
  bulletPoint: {
    width: horizontalScale(10),
    textAlign: 'center',
    top: verticalScale(5),
  },
});
