import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

export enum BookCategorySize {
  SMALL = 'small',
  NORMAL = 'normal',
}

interface bookCategoryProps {
  text: string;
  rubric: string;
  size?: BookCategorySize;
  onPress?: (key: string) => void;
  action?: boolean;
  active?: boolean;
  isOutline?: Boolean;
}

const RubricFilterItem = (props: bookCategoryProps) => {
  const {
    text,
    rubric,
    onPress,
    action = false,
    size = BookCategorySize.NORMAL,
    active = false,
    isOutline = false,
  } = props;

  const colors = useColors();

  const onPressHandler = () => {
    onPress?.(rubric);
  };

  if (isOutline) {
    return (
      <Gradient
        style={[
          styles.RubricFilterItem,
          {
            height: size === BookCategorySize.SMALL ? 28 : 40,
          },
        ]}>
        {active ? (
          <View style={styles.activeItemContent}>
            <TouchableOpacity
              disabled={!action}
              style={styles.btn}
              onPress={onPressHandler}>
              <AppText
                style={[styles.text, {color: colors.bgQuinaryColor}]}
                text={text}
                weight={'500'}
                size={
                  size === BookCategorySize.SMALL
                    ? TextSize.LEVEL_2
                    : TextSize.LEVEL_4
                }
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.content, {backgroundColor: colors.bgColor}]}>
            <TouchableOpacity
              disabled={!action}
              style={styles.btn}
              onPress={onPressHandler}>
              <GradientText
                style={[styles.text]}
                text={text}
                weight={'500'}
                size={
                  size === BookCategorySize.SMALL
                    ? TextSize.LEVEL_2
                    : TextSize.LEVEL_4
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </Gradient>
    );
  }

  return (
    <Gradient
      style={[
        styles.RubricFilterItem,
        {
          height: size === BookCategorySize.SMALL ? 28 : 40,
          opacity: active || !action ? 1 : 0.6,
        },
      ]}>
      <TouchableOpacity
        disabled={!action}
        style={styles.btn}
        onPress={onPressHandler}>
        <AppText
          style={[styles.text, {color: colors.bgQuinaryColor}]}
          text={text}
          weight={'500'}
          size={
            size === BookCategorySize.SMALL
              ? TextSize.LEVEL_2
              : TextSize.LEVEL_4
          }
        />
      </TouchableOpacity>
    </Gradient>
  );
};

export default memo(RubricFilterItem);

const styles = StyleSheet.create({
  RubricFilterItem: {
    borderRadius: moderateScale(10),
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
  },
  btn: {
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(20),
    height: '100%',
  },
  content: {
    flex: 1,
    margin: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  activeItemContent: {
    margin: 1,
  },
});
