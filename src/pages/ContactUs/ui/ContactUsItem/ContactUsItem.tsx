import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface ContactUsItemProps {
  Icon: string;
  text: string;
}

const ContactUsItem = (props: ContactUsItemProps) => {
  const {Icon, text} = props;

  return (
    <View style={styles.contactUsItem}>
      <SvgXml xml={Icon} style={styles.icon} />
      <View style={styles.textWrapper}>
        <AppText weight={'500'} size={TextSize.LEVEL_4} text={text} />
      </View>
    </View>
  );
};

export const Wrapper = memo(ContactUsItem);

const styles = StyleSheet.create({
  contactUsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  textWrapper: {
    position: 'absolute',
    left: 30,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
