import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Challange} from '@src/entities/Challange';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';

const data = [
  {
    image:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%201.png?alt=media&token=e83e70f1-0fff-47ab-8a0e-ba419fc726aa',
  },
  {
    image:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%202.png?alt=media&token=e3abbcc0-ea2d-4cf9-90e3-42627ae525c4',
  },
  {
    image:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%203.png?alt=media&token=0a43e761-998f-41bd-bfda-54b1c03187b7',
  },
  {
    image:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%204.png?alt=media&token=ea807b46-312a-4973-862c-d7181f33ccd7',
  },
  {
    image:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FScreenshot%202023-02-14%20at%2013.20%205.png?alt=media&token=e76db783-c16d-4b9b-991e-b29da3b75c3e',
  },
];

const Challanges = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES);
  };

  return (
    <View>
      <View style={styles.topBlock}>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={t('challenge.title')}
        />
        <Pressable onPress={onPressHandler}>
          <View style={styles.seeAllWrapper}>
            <GradientText
              style={styles.seeAll}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={t('home.see_all')}
            />
            <SvgXml
              xml={getArrowRightIcon({isGradient: true})}
              style={styles.arrowIcon}
            />
          </View>
        </Pressable>
      </View>
      <View style={styles.challangesWrapper}>
        <View style={[styles.challanges, {width: windowWidthMinusPaddings}]}>
          {data.map(item => {
            return <Challange key={item.image} image={item.image} />;
          })}
        </View>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(Challanges);

const styles = StyleSheet.create({
  seeAll: {
    textDecorationLine: 'underline',
  },
  arrowIcon: {
    height: 15,
    width: 15,
    marginLeft: 5,
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
  challangesWrapper: {
    alignItems: 'center',
  },
  challanges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
