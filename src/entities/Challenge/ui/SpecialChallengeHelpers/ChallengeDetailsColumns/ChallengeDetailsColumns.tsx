import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';

interface ChallengeDetailsColumnsProps {
  firstColumn: string[];
  secondColumn: string[];
  thirdColumn?: string[];
  isMarginBottom?: boolean;
}

const ChallengeDetailsColumns = (props: ChallengeDetailsColumnsProps) => {
  const {isMarginBottom, firstColumn, secondColumn, thirdColumn} = props;

  return (
    <View
      style={[
        styles.ChallengeDetailsColumns,
        // eslint-disable-next-line react-native/no-inline-styles
        {marginBottom: isMarginBottom ? verticalScale(10) : 'auto'},
      ]}>
      <View style={{marginRight: horizontalScale(thirdColumn ? 20 : 50)}}>
        {firstColumn.map((item, i) => {
          return (
            <AppText
              style={styles.item}
              key={i.toString()}
              weight={'500'}
              size={TextSize.LEVEL_3}
              text={item}
            />
          );
        })}
      </View>
      <View style={{marginRight: horizontalScale(thirdColumn ? 30 : 50)}}>
        {secondColumn.map((item, i) => {
          return (
            <AppText
              style={styles.item}
              key={i.toString()}
              weight={'500'}
              size={TextSize.LEVEL_3}
              text={item}
            />
          );
        })}
      </View>
      {thirdColumn && (
        <View>
          {thirdColumn.map((item, i) => {
            return (
              <AppText
                style={styles.item}
                key={i.toString()}
                weight={'500'}
                size={TextSize.LEVEL_3}
                text={item}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default memo(ChallengeDetailsColumns);

export const styles = StyleSheet.create({
  ChallengeDetailsColumns: {
    flexDirection: 'row',
  },
  item: {
    marginBottom: verticalScale(8),
  },
});
