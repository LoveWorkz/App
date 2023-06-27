import React, {memo} from 'react';
import {Pressable, View, StyleSheet, SafeAreaView} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {SelectTheme} from './Select';
import Skeleton from '../Skeleton/Skeleton';

interface TouchableComponentProps {
  setIsVisible: (visible: boolean) => void;
  selectedValueStyle?: StyleType;
  label?: string;
  theme?: SelectTheme;
  selectedDisplayValue: string;
  isLoading: boolean;
}

const height = 40;
const borderRadius = moderateScale(10);

export const TouchableComponent = memo((props: TouchableComponentProps) => {
  const {
    setIsVisible,
    selectedValueStyle,
    label,
    theme = SelectTheme.CLEAR,
    selectedDisplayValue,
    isLoading,
  } = props;
  const colors = useColors();
  const {theme: appTheme} = useTheme();
  const isClear = theme === SelectTheme.CLEAR;
  const isValueLarge = selectedDisplayValue.length >= 35;

  const onSelectOpenHandler = () => {
    setIsVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <View style={styles.uploadPhotoWrapper}>
          <View style={styles.label}>
            <Skeleton width={50} height={13} />
          </View>
          <Skeleton
            width={'100%'}
            height={height}
            borderRadius={borderRadius}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={
        isClear ? {} : {...getShadowOpacity(appTheme).shadowOpacity_level_1}
      }>
      {!isClear && label && (
        <AppText
          style={[styles.label, {...selectedValueStyle}]}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={label}
        />
      )}
      <Pressable
        style={[
          styles.wrapper,
          styles[theme],
          {
            backgroundColor: isClear ? colors.bgColor : colors.bgTertiaryColor,
          },
        ]}
        onPress={onSelectOpenHandler}>
        {isClear && label ? (
          <View>
            <AppText style={selectedValueStyle} text={label} />
          </View>
        ) : (
          <View>
            <AppText
              size={isValueLarge ? TextSize.LEVEL_2 : TextSize.LEVEL_3}
              style={selectedValueStyle}
              text={selectedDisplayValue}
            />
          </View>
        )}
        <SvgXml
          xml={SmallArrowRightIcon}
          stroke={colors.primaryTextColor}
          style={styles.icon}
        />
      </Pressable>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  outline: {
    height: height,
    borderRadius: borderRadius,
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
  },
  wrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
  },
  label: {
    marginBottom: verticalScale(5),
  },
  icon: {
    height: horizontalScale(12),
    width: horizontalScale(12),
  },
});

export default memo(TouchableComponent);
