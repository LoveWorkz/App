import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTranslation} from 'react-i18next';

interface ListItemProps {
  text: string;
  prefix?: string;
  hideButton?: boolean;
  onPress?: () => void;
  number?: number;
}

export const TextListItem = memo((props: ListItemProps) => {
  const {text, prefix, hideButton = true, onPress, number} = props;
  const {t} = useTranslation();

  return (
    <View style={styles.TextList}>
      <View style={styles.textWrapper}>
        <AppText
          style={styles.dot}
          size={TextSize.LEVEL_5}
          text={number ? `${number}.` : '•'}
          weight="700"
        />
        <Text style={styles.text}>
          {prefix && (
            <AppText size={TextSize.LEVEL_5} text={`${prefix} `} weight="700" />
          )}
          <AppText size={TextSize.LEVEL_5} weight="500" text={text} />
          {!hideButton && (
            <TouchableOpacity onPress={onPress}>
              <GradientText
                style={styles.readMore}
                size={TextSize.LEVEL_5}
                text={t('common.read_more')}
                weight="500"
              />
            </TouchableOpacity>
          )}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  TextList: {
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
