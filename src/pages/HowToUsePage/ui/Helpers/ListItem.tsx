import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

interface ListItemProps {
  prefix: string;
  text: string;
  hideButton?: boolean;
  onPress?: () => void;
  number?: number;
}

const ListItem = (props: ListItemProps) => {
  const {text, prefix, hideButton, onPress, number} = props;

  return (
    <View style={styles.ListItem}>
      <View style={styles.textWrapper}>
        <AppText
          style={styles.dot}
          size={TextSize.LEVEL_5}
          text={number ? `${number}.` : '•'}
          weight="700"
        />
        <Text style={styles.text}>
          <AppText size={TextSize.LEVEL_5} text={`${prefix} `} weight="700" />
          <AppText size={TextSize.LEVEL_5} weight="500" text={text} />
          {!hideButton && (
            <TouchableOpacity onPress={onPress}>
              <GradientText
                style={styles.readMore}
                size={TextSize.LEVEL_5}
                text={' Read more...'}
                weight="500"
              />
            </TouchableOpacity>
          )}
        </Text>
      </View>
    </View>
  );
};

export default memo(ListItem);

const styles = StyleSheet.create({
  ListItem: {
    marginLeft: horizontalScale(10),
  },
  dot: {
    top: verticalScale(1),
    marginRight: horizontalScale(10),
  },
  textWrapper: {
    flexDirection: 'row',
  },
  text: {
    lineHeight: 25,
  },
  readMore: {
    top: 3,
  },
});
