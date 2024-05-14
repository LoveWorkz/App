import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';

const OrderedList = () => {
  return (
    <>
      <View style={styles.item}>
        <AppText
          size={TextSize.SIZE_24}
          weight="700"
          text={'How to Navigate LoveWorkz'}
        />
      </View>
      <View style={styles.List}>
        <View style={styles.item}>
          <TextListItem
            number={1}
            prefix={'Start with The Journey:'}
            text={
              'Begin with the Love-Yourney to establish a solid foundation of skills and understanding, progressing through levels and quadrants'
            }
          />
        </View>
        <View style={styles.item}>
          <TextListItem
            number={2}
            prefix={'Engage with Challenges:'}
            text={
              'Utilize the challenges at the end of each session to build your toolkit and apply learned concepts to your relationship.'
            }
          />
        </View>
        <View style={styles.item}>
          <TextListItem
            number={3}
            prefix={'Explore Independently:'}
            text={
              'Venture beyond "The Journey" whenever you wish, choosing content that aligns with your relationship\'s needs and interests.'
            }
          />
        </View>
        <TextListItem
          number={4}
          prefix={'Maintain a Positive Outlook:'}
          text={
            'Keep the journey engaging and positive, balancing serious topics with light-hearted discussions to foster a supportive atmosphere.'
          }
        />
      </View>
    </>
  );
};

export default memo(OrderedList);

const styles = StyleSheet.create({
  List: {
    width: '90%',
  },
  item: {
    marginBottom: verticalScale(25),
  },
});
