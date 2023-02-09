import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';

import {InstagramIcon} from '@src/shared/assets/icons/Instagram';
import {LocationIcon} from '@src/shared/assets/icons/Location';
import {PhoneIcon} from '@src/shared/assets/icons/Phone';
import {Wrapper as ContactUsItem} from './ContactUsItem/ContactUsItem';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {ShareIcon} from '@src/shared/assets/icons/Share';

const itemsData = [
  {
    Icon: PhoneIcon,
    text: '+911-07-849-30-85',
  },
  {
    Icon: InstagramIcon,
    text: 'instagram.com/lovenough',
  },
  {
    Icon: LocationIcon,
    text: 'Berlin, 12/2 Elizabeth st., office 456 ',
  },
];

const ContactUs = () => {
  return (
    <SafeAreaView style={styles.contactUs}>
      <View style={styles.itemWrapper}>
        {itemsData.map(item => {
          return <ContactUsItem key={item.text} {...item} />;
        })}
      </View>
      <Button style={styles.btn} theme={ButtonTheme.OUTLINED}>
        <View style={styles.btnTextWrapper}>
          <SvgXml xml={ShareIcon} style={styles.icon} />
          <Text style={styles.btnText}>Share us with your friends</Text>
        </View>
      </Button>
    </SafeAreaView>
  );
};

export const Wrapper = memo(ContactUs);

const styles = StyleSheet.create({
  contactUs: {
    flex: 1,
  },
  itemWrapper: {},
  icon: {
    height: 20,
    width: 20,
  },
  btnTextWrapper: {
    flexDirection: 'row',
  },
  btn: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});
