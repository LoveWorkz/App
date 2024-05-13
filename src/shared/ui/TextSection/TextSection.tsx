import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {TextWeight} from '@src/shared/types/textTypes';
import {AppText, TextSize} from '../AppText/AppText';

export interface TextSectionType {
  text: string;
  textWeight?: TextWeight;
}

interface TextSectionProps {
  title?: string;
  paragraph: TextSectionType | TextSectionType[];
}

export const TextSection = memo((props: TextSectionProps) => {
  const {title, paragraph} = props;

  let content = Array.isArray(paragraph) ? (
    paragraph.map((item, i) => {
      const isLastElement = i === paragraph.length - 1;

      return (
        <View style={isLastElement ? {} : styles.item} key={i.toString()}>
          <AppText
            lineHeight={25}
            size={TextSize.LEVEL_5}
            weight={item.textWeight || '500'}
            text={item.text}
          />
        </View>
      );
    })
  ) : (
    <AppText
      lineHeight={25}
      size={TextSize.LEVEL_5}
      weight={paragraph.textWeight || '500'}
      text={paragraph.text}
    />
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
});

const styles = StyleSheet.create({
  title: {
    marginBottom: verticalScale(25),
  },
  item: {
    marginBottom: verticalScale(25),
  },
});
