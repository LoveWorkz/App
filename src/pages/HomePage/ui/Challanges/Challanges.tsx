import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {ChallengeCategory} from '@src/entities/ChallengeCategory';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {challengesStore} from '@src/pages/ChallengesPage';
import {verticalScale} from '@src/shared/lib/Metrics';

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
          {challengesStore.challengeCategories.map(challange => {
            return (
              <ChallengeCategory
                key={challange.id}
                image={challange.image}
                name={challange.name}
                isBlocked={challange.isBlocked}
                id={challange.id}
                displayName={challange.displayName}
                isHomePage
              />
            );
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
    marginBottom: verticalScale(20),
  },
  challangesWrapper: {
    alignItems: 'center',
  },
  challanges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
