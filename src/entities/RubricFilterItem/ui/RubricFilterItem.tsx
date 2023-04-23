import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';

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
}

const RubricFilterItem = (props: bookCategoryProps) => {
  const {
    text,
    rubric,
    onPress,
    action = false,
    size = BookCategorySize.NORMAL,
    active = false,
  } = props;

  const onPressHandler = () => {
    onPress?.(rubric);
  };

  return (
    <Gradient
      style={[
        styles.RubricFilterItem,
        {
          height: size === BookCategorySize.SMALL ? 28 : 40,
          opacity: active ? 1 : 0.6,
        },
      ]}>
      <TouchableOpacity
        disabled={!action}
        style={styles.btn}
        onPress={onPressHandler}>
        <AppText
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
    </Gradient>
  );
};

export default memo(RubricFilterItem);

const styles = StyleSheet.create({
  RubricFilterItem: {
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'white',
  },
  btn: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
  },
});
