import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';

type SeeAllTheme = 'small' | 'large';

interface SeeAllProps {
  onPressHandler: () => void;
  seeAllTheme?: SeeAllTheme;
}

export const SeeAll = memo((props: SeeAllProps) => {
  const {onPressHandler, seeAllTheme = 'small'} = props;

  const colors = useColors();
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <TouchableOpacity onPress={onPressHandler}>
      <View
        style={[
          styles.SeeAll,
          {
            ...getShadowOpacity(theme, colors.bgSecondaryColor)
              .shadowOpacity_level_1,
            backgroundColor: colors.bgSecondaryColor,
            // backgroundColor: 'red',
          },
          styles[seeAllTheme],
        ]}>
        <AppText weight={'900'} text={t('home.see_all')} />
        <Gradient style={styles.iconWrapper}>
          <SvgXml
            fill={colors.white}
            style={styles.icon}
            xml={getArrowRightIcon({})}
          />
        </Gradient>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  SeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(15),
    borderRadius: moderateScale(20),
  },
  large: {
    height: horizontalScale(100),
  },
  small: {
    height: horizontalScale(75),
  },
  iconWrapper: {
    marginLeft: horizontalScale(10),
    padding: horizontalScale(12),
    borderRadius: moderateScale(50),
  },
  icon: {
    width: horizontalScale(12),
    height: horizontalScale(12),
  },
});
5;
