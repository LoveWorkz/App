import React, {memo} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';

const LanguageSwitcher = () => {
  return (
    <View style={styles.languageSwitcher}>
      <View>
        <Text style={styles.text}>Language</Text>
      </View>
      <View>
        <Pressable>
          <SvgXml xml={ArrowDownIcon} style={styles.arrowIcon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  arrowIcon: {
    width: 15,
    height: 15,
  },
});

export const Wrapper = memo(LanguageSwitcher);
