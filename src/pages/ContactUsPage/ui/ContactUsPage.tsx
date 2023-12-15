import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {InstagramIconWithoutColor} from '@src/shared/assets/icons/Instagram';
import {LocationIcon} from '@src/shared/assets/icons/Location';
import {PhoneIcon} from '@src/shared/assets/icons/Phone';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {Wrapper as ContactUsItem} from './ContactUsItem/ContactUsItem';

const getItemsData = (color: string) => {
  return [
    {
      Icon: () => <SvgXml xml={PhoneIcon} style={styles.icon} stroke={color} />,
      text: '+911-07-849-30-85',
    },
    {
      Icon: () => (
        <SvgXml
          xml={InstagramIconWithoutColor}
          style={styles.icon}
          stroke={color}
        />
      ),
      text: 'instagram.com/lovenough',
    },
    {
      Icon: () => (
        <SvgXml xml={LocationIcon} style={styles.icon} fill={color} />
      ),
      text: 'Berlin, 12/2 Elizabeth st., office 456 ',
    },
  ];
};

const ContactUsPage = () => {
  const colors = useColors();

  return (
    <View style={styles.contactUs}>
      <View>
        {getItemsData(colors.primaryTextColor).map(item => {
          return <ContactUsItem key={item.text} {...item} />;
        })}
      </View>
    </View>
  );
};

export const Wrapper = memo(ContactUsPage);

const styles = StyleSheet.create({
  contactUs: {
    flex: 1,
  },
  icon: {
    width: horizontalScale(20),
    height: horizontalScale(20),
  },
});
