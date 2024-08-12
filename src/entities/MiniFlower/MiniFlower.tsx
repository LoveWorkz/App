import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React from 'react';

import {BottomLeaf} from './BottomLeaf';
import {TopLeaf} from './TopLeaf';
import {LeftLeaf} from './LeftLeaf';
import {RightLeaf} from './RightLeaf';
import {useTheme} from '@src/app/providers/themeProvider';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

type MiniFlowerProps = {
  bottomLetter?: string;
  topLetter?: string;
  leftLetter?: string;
  rightLetter?: string;
  currentLevel?: number;
};

export const MiniFlower = ({
  topLetter = 'A',
  rightLetter = 'B',
  bottomLetter = 'C',
  leftLetter = 'D',
  currentLevel,
}: MiniFlowerProps) => {
  const {isDark} = useTheme();
  const colors = useColors();
  const leafWidth = 36;
  const leafHeight = 44;
  const circleSize = isDark ? 10 : 5;
  const centerOffset = 0;
  const textOffset = centerOffset + 2;
  const boxSize = leafHeight * 2 + circleSize;

  const rightPos = {
    top: -leafWidth / 2 + circleSize / 2,
    right: -leafHeight + circleSize / 2 - centerOffset,
  };
  const leftPos = {
    top: -leafWidth / 2 + circleSize / 2,
    left: -leafHeight + circleSize / 2 - centerOffset,
  };
  const topPos = {
    top: -leafHeight + circleSize / 2 - centerOffset,
    left: -leafWidth / 2 + circleSize / 2,
  };
  const bottomPos = {
    bottom: -leafHeight + circleSize / 2 - centerOffset,
    left: -leafWidth / 2 + circleSize / 2,
  };

  const topViewBox = {
    width: leafWidth,
    height: leafHeight,
    top: -leafHeight - textOffset - centerOffset / 2,
    left: -leafWidth / 2 + circleSize / 2,
  };
  const topText = {top: leafHeight / 2};

  const rightViewBox = {
    height: leafWidth,
    width: leafHeight,
    bottom: -leafWidth / 2 + circleSize / 2,
  };
  const rightText = {};

  const bottomViewBox = {
    width: leafWidth,
    height: leafHeight,
    bottom: -leafHeight - textOffset - centerOffset / 2,
    left: -leafWidth / 2 + circleSize / 2,
  };

  const bottomText = {
    bottom: leafHeight / 2,
  };

  const leftViewBox = {
    height: leafWidth,
    width: leafHeight,
    right: 0,
    bottom: -leafWidth / 2 + circleSize / 2,
  };
  const leftText = {};

  const circleStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    backgroundColor: isDark ? colors.bgTertiaryColor : colors.white,
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    top: boxSize / 2 - circleSize / 2,
    left: boxSize / 2 - circleSize / 2,
  };

  const flowerColors = {
    text: {
      base: colors.white,
      finished: '#5b46d1',
    },
    background: {
      base: '#5b46d1',
      finished: colors.white,
    },
  };

  const isLevelCompleted = (level: number, type: 'background' | 'text') => {
    if (currentLevel && level <= currentLevel) {
      return flowerColors[type].finished;
    } else {
      return flowerColors[type].base;
    }
  };

  return (
    <View style={{height: boxSize, width: boxSize}}>
      <View style={[circleStyle]}>
        <TopLeaf
          style={[styles.leaf, topPos]}
          tintColor={isLevelCompleted(1, 'background')}
        />
        <View style={[styles.letterViewBox, topViewBox]}>
          <AppText
            size={TextSize.LEVEL_2}
            text={topLetter}
            style={[
              styles.letter,
              topText,
              {color: isLevelCompleted(1, 'text')},
            ]}
          />
        </View>
        <RightLeaf
          style={[styles.leaf, rightPos]}
          tintColor={isLevelCompleted(2, 'background')}
        />
        <View style={[styles.letterViewBox, rightViewBox]}>
          <AppText
            size={TextSize.LEVEL_2}
            text={rightLetter}
            style={[
              styles.letter,
              rightText,
              {color: isLevelCompleted(2, 'text')},
            ]}
          />
        </View>
        <BottomLeaf
          style={[styles.leaf, bottomPos]}
          tintColor={isLevelCompleted(3, 'background')}
        />
        <View style={[styles.letterViewBox, bottomViewBox]}>
          <AppText
            size={TextSize.LEVEL_2}
            text={bottomLetter}
            style={[
              styles.letter,
              bottomText,
              {color: isLevelCompleted(3, 'text')},
            ]}
          />
        </View>
        <LeftLeaf
          style={[styles.leaf, leftPos]}
          tintColor={isLevelCompleted(4, 'background')}
        />
        <View style={[styles.letterViewBox, leftViewBox]}>
          <AppText
            size={TextSize.LEVEL_2}
            text={leftLetter}
            style={[
              styles.letter,
              leftText,
              {color: isLevelCompleted(4, 'text')},
            ]}
          />
        </View>
      </View>
      <View style={circleStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  leaf: {
    position: 'absolute',
    overflow: 'visible',
  },
  letterViewBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  letter: {
    position: 'absolute',
  },
});
