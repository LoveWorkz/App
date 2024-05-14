import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';

const List = () => {
  return (
    <View style={styles.List}>
      <View style={styles.listItem}>
        <TextListItem
          text={
            'Take Turns: Decide who asks the first question. After answering, swap roles for the next card. This back-and-forth keeps it fair and engaging. Swipe to the next card after both have answers keeps the session flowing smoothly.'
          }
        />
      </View>
      <View style={styles.listItem}>
        <TextListItem
          text={
            "It's Okay to Pass: If any question doesn't feel right, just skip it. There's plenty more to explore. Simply move on to the next card."
          }
        />
      </View>
      <TextListItem
        text={
          "Offer Empathy: Respond to each other's answers with an open heart, free from judgment. This is your space to offer support, understanding, and empathy."
        }
      />
    </View>
  );
};

export default memo(List);

const styles = StyleSheet.create({
  List: {
    width: '95%',
  },
  listItem: {
    marginBottom: verticalScale(25),
  },
});
