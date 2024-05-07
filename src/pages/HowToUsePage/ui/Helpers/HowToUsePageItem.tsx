import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';

interface HowToUsePageItemProps {
  title?: string;
  text: string[] | string;
}

const HowToUsePageItem = (props: HowToUsePageItemProps) => {
  const {title, text} = props;

  let content =
    typeof text === 'string' ? (
      <AppText
        lineHeight={25}
        size={TextSize.LEVEL_5}
        weight="500"
        text={text}
      />
    ) : (
      text.map((item, i) => {
        const isLastElement = i === text.length - 1;

        return (
          <View style={isLastElement ? {} : styles.item} key={i.toString()}>
            <AppText
              lineHeight={25}
              size={TextSize.LEVEL_5}
              weight="500"
              text={item}
            />
          </View>
        );
      })
    );

  return (
    <>
      {title && (
        <View style={styles.title}>
          <AppText size={TextSize.SIZE_24} weight="700" text={title} />
        </View>
      )}
      {content}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: verticalScale(25),
  },
  item: {
    marginBottom: verticalScale(25),
  },
});

export default memo(HowToUsePageItem);
