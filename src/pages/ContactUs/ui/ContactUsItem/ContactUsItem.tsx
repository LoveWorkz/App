import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';

interface ContactUsItemProps {
  Icon: string;
  text: string;
}

const ContactUsItem = (props: ContactUsItemProps) => {
  const {Icon, text} = props;

  return (
    <SafeAreaView style={styles.contactUsItem}>
      <SvgXml xml={Icon} style={styles.icon} />
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </SafeAreaView>
  );
};

export const Wrapper = memo(ContactUsItem);

const styles = StyleSheet.create({
  contactUsItem: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 15,
  },
  textWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    left: 30,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 16,
  },
});
