import React, {memo} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {useColors} from '@src/app/providers/colorsProvider';

export const categoryData = [
  {
    status: 'DEEP',
    count: 5,
  },
  {
    status: 'BASIC',
    count: 6,
  },
  {
    status: 'DEEP',
    count: 4,
  },
  {
    status: 'BASIC',
    count: 2,
  },
  {
    status: 'BASIC',
    count: 1,
  },
];

interface CategoryProps {
  status: string;
  count: number;
}

const Category = (props: CategoryProps) => {
  const {count = 0, status} = props;
  const colors = useColors();

  return (
    <ImageBackground
      resizeMode="cover"
      style={[styles.category]}
      source={{
        uri: 'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2F2%205.png?alt=media&token=ddd61be9-125a-4184-983e-f332430255f2',
      }}>
      <Gradient style={styles.questions}>
        <AppText
          style={styles.questionsText}
          weight={'700'}
          size={TextSize.LEVEL_2}
          text={`${count} questions`}
        />
      </Gradient>
      <AppText
        style={[styles.status, {color: colors.primaryTextColor}]}
        weight={'700'}
        size={TextSize.LEVEL_4}
        text={status}
      />
    </ImageBackground>
  );
};

export const ComponentWrapper = memo(Category);

const styles = StyleSheet.create({
  category: {
    padding: 10,
    height: 145,
    backgroundColor: '#ECEFF1',
    borderRadius: 20,
  },
  questions: {
    width: 89,
    height: 23,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  questionsText: {
    color: 'white',
  },
  status: {
    marginTop: 8,
    marginLeft: 10,
  },
});
