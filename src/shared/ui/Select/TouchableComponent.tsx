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
  onSelectOpenHandler: () => void;
  selectedValueStyle?: StyleType;
  label?: string;
  theme?: SelectTheme;
  selectedDisplayValue: string;
  isLoading: boolean;
  placeholder?: string;
}

const height = 40;
const borderRadius = moderateScale(10);

export const TouchableComponent = memo((props: TouchableComponentProps) => {
  const {
    onSelectOpenHandler,
    selectedValueStyle,
    label,
    theme = SelectTheme.CLEAR,
    selectedDisplayValue,
    isLoading,
    placeholder,
  } = props;
  const colors = useColors();
  const {theme: appTheme} = useTheme();
  const isClear = theme === SelectTheme.CLEAR;
  const isValueLarge = selectedDisplayValue.length >= 35;

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

  let content = (
    <View>
      <AppText
        size={isValueLarge ? TextSize.LEVEL_2 : TextSize.LEVEL_3}
        style={{color: colors.secondaryTextColor}}
        text={placeholder || ''}
      />
    </View>
  );

  if (isClear && label) {
    content = (
      <View>
        <AppText style={selectedValueStyle} text={label} />
      </View>
    );
  } else if (selectedDisplayValue) {
    content = (
      <View>
        <AppText
          size={isValueLarge ? TextSize.LEVEL_2 : TextSize.LEVEL_3}
          style={selectedValueStyle}
          text={selectedDisplayValue}
        />
      </View>
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
        {content}
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
