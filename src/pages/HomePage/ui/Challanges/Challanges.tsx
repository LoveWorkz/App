import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Challange} from '@src/entities/Challange';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const data = [
  {
    text: 'Bronze',
    active: true,
  },
  {
    text: 'Silver',
    active: false,
  },
  {
    text: 'Gold',
    active: false,
  },
];

const Challanges = () => {
  const {t} = useTranslation();

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES);
  };

  return (
    <View>
      <View style={styles.topBlock}>
        <AppText
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={t('challenge.title')}
        />
        <Pressable onPress={onPressHandler}>
          <View style={styles.seeAllWrapper}>
            <AppText
              style={styles.seeAll}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={t('home.see_all')}
            />
            <SvgXml xml={ArrowRightIcon} style={styles.arrowIcon} />
          </View>
        </Pressable>
      </View>
      <View style={styles.challanges}>
        {data.map(item => {
          return (
            <Challange key={item.text} text={item.text} active={item.active} />
          );
        })}
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(Challanges);

const styles = StyleSheet.create({
  seeAll: {
    marginRight: 5,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  challanges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
