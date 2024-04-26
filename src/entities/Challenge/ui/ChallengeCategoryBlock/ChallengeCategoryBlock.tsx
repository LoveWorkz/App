import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface ChallengeCategoryBlockProps {
  text: string;
}

const ChallengeCategoryBlock = (props: ChallengeCategoryBlockProps) => {
  const {text} = props;

  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  return (
    <View>
      <View style={styles.category}>
        <View style={[styles.layout, {backgroundColor: colors.white}]} />

        <AppText
          style={textStyle}
          weight={'500'}
          size={TextSize.LEVEL_2}
          text={text}
        />
      </View>
    </View>
  );
};

const categoryBorderRadius = moderateScale(10);

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(15),
    borderRadius: categoryBorderRadius,
    height: horizontalScale(30),
    alignSelf: 'flex-start',
  },
  layout: {
    borderRadius: categoryBorderRadius,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.1,
  },
});

export default memo(ChallengeCategoryBlock);
