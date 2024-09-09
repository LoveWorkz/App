import {View, StyleSheet} from 'react-native';
import React from 'react';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';

type Props = {
  text: string;
};

export const Badge = ({text}: Props) => {
  const colors = useColors();
  const {isDark} = useTheme();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
      ]}>
      <AppText size={TextSize.LEVEL_4} text={text} />
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginVertical: 4,
  },
});
