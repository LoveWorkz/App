import React, {memo} from 'react';
import {Pressable, View, StyleSheet, SafeAreaView} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import Skeleton from '../Skeleton/Skeleton';

interface TouchableComponentProps {
  onSelectOpenHandler: () => void;
  selectedValueStyle?: StyleType;
  label?: string;
  selectedDisplayValue: string;
  isLoading: boolean;
  placeholder?: string;
  error?: string | null;
}

const height = 40;
const borderRadius = moderateScale(10);

export const TouchableComponent = memo((props: TouchableComponentProps) => {
  const {
    onSelectOpenHandler,
    selectedValueStyle,
    label,
    selectedDisplayValue,
    isLoading,
    placeholder,
    error,
  } = props;
  const colors = useColors();
  const {theme} = useTheme();
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

  content = (
    <View>
      <AppText
        size={isValueLarge ? TextSize.LEVEL_2 : TextSize.LEVEL_3}
        style={selectedValueStyle}
        text={selectedDisplayValue}
      />
    </View>
  );

  return (
    <SafeAreaView style={{...getShadowOpacity(theme).shadowOpacity_level_1}}>
      {label && (
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
          {
            backgroundColor: colors.bgTertiaryColor,
          },
        ]}
        onPress={onSelectOpenHandler}>
        {content}
        <SvgXml
          xml={ArrowDownIcon}
          stroke={colors.primaryTextColor}
          style={styles.icon}
        />
      </Pressable>

      {error && (
        <AppText
          size={TextSize.LEVEL_1}
          weight={'500'}
          type={TextType.ERROR}
          style={[styles.errorText, {color: colors.secondaryError}]}
          text={error}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  wrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
    height: height,
    borderRadius: borderRadius,
    paddingHorizontal: horizontalScale(20),
  },
  label: {
    marginBottom: verticalScale(5),
  },
  icon: {
    height: horizontalScale(12),
    width: horizontalScale(12),
  },
  errorText: {
    position: 'absolute',
    bottom: -14,
  },
});
