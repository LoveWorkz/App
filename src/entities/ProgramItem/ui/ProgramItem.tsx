import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

type Props = {
  text: string;
  isOdd?: boolean;
};

export const ProgramItem = ({isOdd, text}: Props) => {
  const colors = useColors();
  const {isDark} = useTheme();

  return (
    <View
      style={[styles.container, isOdd ? styles.oddStyles : styles.evenStyles]}>
      <View
        style={[
          styles.tile,
          {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
        ]}>
        <GradientText text={text} />
      </View>
    </View>
  );
};

export default ProgramItem;

export const styles = StyleSheet.create({
  container: {
    width: '50%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 2,
  },
  oddStyles: {
    paddingRight: 6,
  },
  evenStyles: {
    paddingLeft: 6,
  },
  tile: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
});
