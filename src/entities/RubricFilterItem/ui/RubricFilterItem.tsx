import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

export enum BookCategorySize {
  SMALL = 'small',
  NORMAL = 'normal',
}

interface bookCategoryProps {
  rubric: string;
  size?: BookCategorySize;
  onPress?: (key: string) => void;
  action?: boolean;
  active?: boolean;
  isOutline?: Boolean;
  displayName: string;
}

const RubricFilterItem = (props: bookCategoryProps) => {
  const {
    displayName,
    rubric,
    onPress,
    action = false,
    size = BookCategorySize.NORMAL,
    active = false,
    isOutline = false,
  } = props;

  const colors = useColors();
  const {t} = useTranslation();
  const name = t(displayName);

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
                style={[{color: colors.bgQuinaryColor}]}
                text={name}
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
                text={name}
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
          style={[{color: colors.bgQuinaryColor}]}
          text={name}
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
  btn: {
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(20),
    height: '100%',
    alignItems: 'center',
    marginTop: verticalScale(-1),
  },
  content: {
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
