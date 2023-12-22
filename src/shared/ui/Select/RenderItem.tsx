import React, {memo, useCallback, useMemo} from 'react';
import {SvgXml} from 'react-native-svg';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Flag from 'react-native-flags';

import {SelectOption} from '@src/shared/types/types';
import {CheckIcon} from '@src/shared/assets/icons/Check';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '../AppText/AppText';

interface RenderItemProps {
  item: SelectOption;
  onSelectHandler: (value: string) => void;
  selectedValue: string;
  itemHeight: number;
  isLastItem: boolean;
  isCountry?: boolean;
}

export const RenderItem = memo((props: RenderItemProps) => {
  const {
    item,
    onSelectHandler,
    selectedValue,
    itemHeight,
    isLastItem,
    isCountry = false,
  } = props;

  const colors = useColors();

  const {value, label} = item;
  const isSelected = value === selectedValue;
  const borderBottomColor = isLastItem
    ? 'transparent'
    : colors.borderBottomColor;

  const onChange = useCallback(
    () => onSelectHandler(value),
    [value, onSelectHandler],
  );

  const mode = useMemo(() => {
    return {height: itemHeight};
  }, [itemHeight]);

  return (
    <TouchableOpacity
      onPress={onChange}
      style={[
        mode,
        styles.container,
        {
          borderBottomColor,
        },
        isSelected ? [styles.active, {backgroundColor: colors.white}] : {},
      ]}>
      {isCountry ? (
        <View style={styles.flagWrapper}>
          <Flag code={value} size={32} />
          <View style={styles.text}>
            <AppText size={TextSize.LEVEL_4} weight={'600'} text={label} />
          </View>
        </View>
      ) : (
        <AppText size={TextSize.LEVEL_4} weight={'600'} text={label} />
      )}

      {isSelected && (
        <SvgXml
          xml={CheckIcon}
          stroke={colors.primaryTextColor}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(15),
    borderBottomWidth: 1,
  },
  checkIcon: {
    width: horizontalScale(12),
    height: horizontalScale(12),
  },
  active: {
    borderRadius: moderateScale(10),
    borderBottomColor: 'transparent',
  },
  flagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    left: horizontalScale(15),
  },
});
