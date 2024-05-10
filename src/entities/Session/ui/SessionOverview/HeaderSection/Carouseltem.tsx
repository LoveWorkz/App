import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {InformationIcon} from '@src/shared/assets/icons/Information';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {CategoryImageType} from 'src/entities/Category';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {Button} from '@src/shared/ui/Button/Button';
import {DisplayText} from '@src/shared/types/types';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

interface Carouseltemrops {
  image: CategoryImageType;
  displayName: DisplayText;
  sessionsCount: number;
  currentSessionNumber: number;
  isFavorite: boolean;
  id: string;
}

const Carouseltem = (props: Carouseltemrops) => {
  const {
    image,
    displayName,
    sessionsCount,
    currentSessionNumber,
    isFavorite,
    id,
  } = props;
  const colors = useColors();
  const language = useLanguage();

  const onPressHandler = () => {
    navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {id});
  };

  const source = useMemo(() => {
    return {uri: image.large};
  }, [image]);

  return (
    <View>
      <FastImage style={styles.Carouseltem} source={source} />
      <View style={styles.topSection}>
        <Button
          onPress={onPressHandler}
          style={styles.btn}
          backgroundColor={'transparent'}>
          <View style={styles.titleWrapper}>
            <SvgXml
              xml={InformationIcon}
              style={styles.icon}
              stroke={colors.primaryTextColor}
            />
            <AppText
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={displayName[language]}
            />
          </View>
        </Button>
        {isFavorite ? (
          <></>
        ) : (
          <View
            style={[
              styles.countWrapper,
              {backgroundColor: colors.periwinkleDust},
            ]}>
            <AppText
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={`${currentSessionNumber}/${sessionsCount}`}
            />
          </View>
        )}
      </View>
      <View style={styles.descriptionWrapper}>
        <AppText
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={
            "Exploring individual personalities and life backgrounds; beginning to understand each other's basic needs and preferences."
          }
        />
      </View>
    </View>
  );
};

export default memo(Carouseltem);

const styles = StyleSheet.create({
  Carouseltem: {
    height: verticalScale(200),
    width: '100%',
    borderRadius: moderateScale(15),
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  btn: {
    width: horizontalScale(200),
    justifyContent: 'center',
    height: 'auto',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  countWrapper: {
    borderRadius: moderateScale(20),
    paddingVertical: horizontalScale(10),
    paddingHorizontal: horizontalScale(12),
  },
  descriptionWrapper: {
    width: '90%',
    marginTop: verticalScale(15),
  },
  icon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
    marginRight: horizontalScale(10),
    top: 2,
  },
});
