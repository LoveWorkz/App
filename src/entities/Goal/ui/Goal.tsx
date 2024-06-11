import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {goalBackgroundImage, goalIconBgDark} from '@src/shared/assets/images';

interface GoalProps {
  isSelected: boolean;
  name: DisplayText;
  icon: string;
  keyName: string;
  onChangeGoalStatus: (id: string) => void;
  id: string;
}

const Goal = (props: GoalProps) => {
  const {isSelected, name, icon, keyName, onChangeGoalStatus, id} = props;

  const {i18n} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();

  const language = i18n.language as LanguageValueType;
  const isKeyImproveParenting = keyName === 'improve_co_parenting';

  const onPressHandler = () => {
    onChangeGoalStatus(id);
  };

  const IconContent = isKeyImproveParenting ? (
    <View>
      <SvgXml xml={icon} style={[styles.icon, styles.firstIcon]} />
      <SvgXml xml={icon} style={styles.secondIcon} />
    </View>
  ) : (
    <SvgXml xml={icon} style={styles.icon} />
  );

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={[
        styles.container,
        {
          ...getShadowOpacity(theme, colors.white).shadowOpacity_level_2,
          backgroundColor: colors.white,
        },
      ]}>
      {isSelected ? (
        <FastImage
          style={styles.Goal}
          source={isSelected ? goalBackgroundImage : undefined}>
          <AppText
            style={[styles.name, {color: colors.primaryTextColor}]}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={name[language]}
          />
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.white,
              },
            ]}>
            {IconContent}
            <View style={styles.checkbox}>
              <CustomCheckBox disabled={true} checked={true} />
            </View>
          </View>
        </FastImage>
      ) : (
        <View style={styles.Goal}>
          <AppText
            style={[styles.name, {color: colors.primaryTextColor}]}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={name[language]}
          />

          <FastImage source={goalIconBgDark} style={[styles.iconWrapper]}>
            {IconContent}
          </FastImage>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(Goal);

const borderRadius = 20;

const styles = StyleSheet.create({
  container: {
    borderRadius,
  },
  Goal: {
    minHeight: 92,
    borderRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: horizontalScale(15),
  },
  name: {
    width: '80%',
  },
  iconWrapper: {
    height: 52,
    width: 52,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },

  firstIcon: {
    right: 3,
  },
  icon: {
    width: 28,
    height: 28,
    zIndex: 2,
  },
  secondIcon: {
    width: 15,
    height: 15,
    position: 'absolute',
    right: -2,
    bottom: -1,
    zIndex: 1,
  },
});
