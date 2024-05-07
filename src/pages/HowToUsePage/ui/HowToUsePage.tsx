import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {
  firstDescriptions,
  maintainingAPositiveEmotionalClimate,
} from '../lib/howToUse';
import HowToUsePageItem from './Helpers/HowToUsePageItem';
import EntityInformationList from './EntityInformationList';
import OrderedList from './OrderedList';
import Images from './Images';

const HowToUsePage = () => {
  return (
    <View style={styles.howToUse}>
      <Images />
      <View style={styles.content}>
        <View style={styles.item}>
          <HowToUsePageItem text={firstDescriptions} />
        </View>
        <View style={styles.item}>
          <EntityInformationList />
        </View>
        <View style={styles.item}>
          <HowToUsePageItem
            title="Building Your Toolkit with Challenges"
            text={
              'But it’s not just about asking questions; it’s about fostering real change. Each session concludes with one challenge—think of it as homework or a tool—designed to translate insights into action. These challenges, exercises, activities, self-reflection exercises, games and routines are handpicked and sequenced to ensure that as you progress, you’re building on a solid foundation (a toolkit) of skills and understanding. This toolkit grows with each completed challenge, equipping you for future challenges and deepening your bond.'
            }
          />
        </View>
        <View style={styles.item}>
          <HowToUsePageItem
            title="Maintaining a Positive Emotional Climate"
            text={maintainingAPositiveEmotionalClimate}
          />
        </View>
        <View style={styles.item}>
          <GradientText
            lineHeight={25}
            size={TextSize.SIZE_24}
            align="center"
            weight="700"
            text={'“In a nutshell, we want you to have fun”'}
          />
        </View>
        <View style={styles.item}>
          <HowToUsePageItem
            title="You can always do more"
            text={
              'Beyond "The Journey," LoveWorkz offers the freedom to explore sessions, questions, and challenges independently. This mode enables you to focus on specific areas of interest at your own pace, perfect for supplementing the structured journey or diving deeper into particular topics.'
            }
          />
        </View>
        <View style={styles.item}>
          <OrderedList />
        </View>
        <View style={styles.item}>
          <HowToUsePageItem
            text={
              "LoveWorkz is designed to be more than just an app; it's a partner in your journey toward a deeper connection and understanding. Play it as a standalone tool or even more powerful along a couple therapy."
            }
          />
        </View>
      </View>
    </View>
  );
};

export default memo(HowToUsePage);

const top = verticalScale(-120);

const styles = StyleSheet.create({
  howToUse: {
    flex: 1,
    marginBottom: top,
  },
  image: {
    height: verticalScale(400),
    width: windowWidth,
    left: -globalPadding,
  },
  content: {
    top,
  },
  descriptionWrapper: {
    marginBottom: verticalScale(30),
  },
  item: {
    marginBottom: verticalScale(40),
  },
});
