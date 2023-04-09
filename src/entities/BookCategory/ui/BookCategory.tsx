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
  category: string;
  size?: BookCategorySize;
  onPress?: (key: string) => void;
  action?: boolean;
}

const BookCategory = (props: bookCategoryProps) => {
  const {
    text,
    category,
    onPress,
    action = false,
    size = BookCategorySize.NORMAL,
  } = props;

  const onPressHandler = () => {
    onPress?.(category);
  };

  return (
    <Gradient
      style={[
        styles.BookCategory,
        {height: size === BookCategorySize.SMALL ? 28 : 40},
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
              : TextSize.LEVEL_5
          }
        />
      </TouchableOpacity>
    </Gradient>
  );
};

export const Wrapper = memo(BookCategory);

const styles = StyleSheet.create({
  BookCategory: {
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
