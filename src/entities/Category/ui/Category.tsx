import React, {memo} from 'react';
import {ImageBackground, Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {useColors} from '@src/app/providers/colorsProvider';
import {StyleType} from '@src/shared/types/types';
import {
  categoryLayoutIconZIndex,
  categoryLayoutZIndex,
  globalStyles,
} from '@src/app/styles/GlobalStyle';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {CateorySize} from '../model/types/categoryTypes';

interface CategoryProps {
  style?: StyleType;
  questions: string[];
  name: string;
  image: string;
  size?: CateorySize;
  isBlocked: boolean;
  id: string;
  isCategoryDetailsVisible: boolean;
}

const Category = (props: CategoryProps) => {
  const {
    questions,
    name,
    image,
    size = CateorySize.L,
    isBlocked = false,
    id,
    isCategoryDetailsVisible,
    style,
  } = props;
  const colors = useColors();

  const onCategoryPressHandler = () => {
    if (isCategoryDetailsVisible) {
      navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {title: name, id});
    } else {
      navigation.navigate(AppRouteNames.QUESTIONS, {type: 'category', id});
    }
  };

  return (
    <Pressable onPress={onCategoryPressHandler}>
      {isBlocked && (
        <>
          <View
            style={[
              styles.layout,
              styles[size],
              {
                zIndex: categoryLayoutZIndex,
              },
            ]}
          />
          <View
            style={[
              styles.lockIconWrapper,
              {zIndex: categoryLayoutIconZIndex},
            ]}>
            <SvgXml xml={LockIcon} fill={'white'} style={styles.lockIcon} />
          </View>
        </>
      )}
      <ImageBackground
        resizeMode="cover"
        imageStyle={[styles.image]}
        style={[
          styles.category,
          styles[size],
          style,
          {...globalStyles.shadowOpacity},
        ]}
        source={{
          uri: image,
        }}>
        <Gradient size={GradientSize.SMALL}>
          <AppText
            style={styles.questionsText}
            weight={'500'}
            size={TextSize.LEVEL_3}
            text={`${questions.length} questions`}
          />
        </Gradient>
        <AppText
          style={[styles.status, {color: colors.primaryTextColor}]}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={name}
        />
      </ImageBackground>
    </Pressable>
  );
};

export default memo(Category);

const styles = StyleSheet.create<Record<string, any>>({
  category: {
    padding: 10,
    borderRadius: 20,
    borderColor: 'silver',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  image: {
    borderRadius: 20,
    aspectRatio: 1 / 2,
  },
  questionsText: {
    color: 'white',
  },
  status: {
    marginTop: 8,
    textTransform: 'uppercase',
  },
  layout: {
    backgroundColor: 'black',
    position: 'absolute',
    opacity: 0.4,
    width: '100%',
    borderRadius: 20,
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lockIcon: {
    height: 35,
    width: 27,
  },

  size_m: {
    height: 120,
  },
  size_l: {
    height: 145,
  },
  size_xl: {
    height: 200,
  },
});
