import React, {memo} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  getShadowOpacity,
  globalPadding,
  windowHeight,
  windowWidth,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {capitalize, toUpper} from 'lodash';

interface BookProps {
  description: string;
  bookLink: string;
  isLoading: boolean;
}

const borderRadius = 30;

const Description = (props: BookProps) => {
  const {description, bookLink, isLoading} = props;

  const colors = useColors();
  const {theme, isDark} = useTheme();
  const {t} = useTranslation();

  const descriptionHeight = windowHeight * 0.55;
  const verticalPaddings = globalPadding + globalPadding;
  const descriptionHeightWinusPaddings = descriptionHeight - verticalPaddings;

  const onPressHandler = () => {
    Linking.openURL(bookLink);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.description,
          {
            height: verticalScale(descriptionHeight),
            width: windowWidth,
            left: -globalPadding,
          },
        ]}>
        <Skeleton
          height={descriptionHeight}
          width={windowWidth}
          borderRadius={moderateScale(borderRadius)}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.description,
        {
          ...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_3,
          height: verticalScale(descriptionHeight),
          width: windowWidth,
          left: -globalPadding,
          backgroundColor: colors.bgTertiaryColor,
        },
      ]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View
          style={[
            styles.content,
            {
              minHeight: verticalScale(descriptionHeightWinusPaddings),
            },
          ]}>
          <View style={{width: windowWidthMinusPaddings}}>
            <AppText
              style={[styles.bottomTitle, {color: colors.primaryTextColor}]}
              text={t('books.description')}
              weight={'500'}
              size={TextSize.LEVEL_7}
            />
            <AppText
              style={[styles.bottomTitle, {color: colors.primaryTextColor}]}
              text={description}
              weight={isPlatformIos ? '400' : '100'}
              size={TextSize.LEVEL_4}
            />
          </View>
          <Button
            onPress={onPressHandler}
            style={styles.btnWrapper}
            theme={ButtonTheme.GRADIENT}>
            <AppText
              weight={'700'}
              style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
              text={capitalize(t('common.buy_now'))}
              size={TextSize.LEVEL_4}
            />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(Description);

const styles = StyleSheet.create({
  description: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    padding: globalPadding,
    alignItems: 'center',
    position: 'absolute',
    bottom: -(globalPadding + 10),
  },
  content: {
    paddingBottom: verticalScale(90),
  },
  bottomTitle: {
    marginBottom: verticalScale(15),
  },
  btnWrapper: {
    position: 'absolute',
    bottom: verticalScale(15),
    height: verticalScale(50),
    width: '100%',
    borderRadius: moderateScale(10),
  },
});
