import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {ChallengeCategory} from '@src/entities/ChallengeCategory';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {cutText} from '@src/shared/lib/common';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {ChallengeType} from '../model/types/ChallengeTypes';
import challengeStore from '../model/store/challengeStore';

interface SubChallengeProps {
  challenge: ChallengeType;
}

export const SubChallenge = (props: SubChallengeProps) => {
  const {challenge} = props;
  const {title, description, isChecked, nomer, id} = challenge;
  const colors = useColors();
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);

  const StandardTextLength = 50;
  const ISDescriptionLarge = description.length > StandardTextLength;

  const onShowHandler = () => {
    setVisible(true);
  };

  const onHideHandler = () => {
    setVisible(false);
  };

  const onChangeHandler = useCallback(() => {
    challengeStore.selectChallenge({id, t});
  }, [id, t]);

  return (
    <View
      style={[styles.SubChallenge, {backgroundColor: colors.bgSecondaryColor}]}>
      <View style={styles.nomerWrapper}>
        <ChallengeCategory number={nomer} isActive={isChecked} />
      </View>
      <View style={styles.textWrapper}>
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          weight={'500'}
          size={TextSize.LEVEL_4}
          text={title}
        />
        {visible ? (
          <>
            <AppText
              style={styles.description}
              size={TextSize.LEVEL_4}
              text={description}
            />
            <TouchableOpacity onPress={onHideHandler}>
              <GradientText
                style={styles.showLess}
                weight={'700'}
                size={TextSize.LEVEL_4}
                text={t('show_less')}
              />
            </TouchableOpacity>
          </>
        ) : (
          <Text>
            <AppText
              style={styles.description}
              size={TextSize.LEVEL_4}
              text={
                ISDescriptionLarge
                  ? cutText({text: description, textSize: StandardTextLength})
                  : description
              }
            />
            <TouchableOpacity onPress={onShowHandler}>
              <GradientText
                style={styles.showMore}
                weight={'700'}
                size={TextSize.LEVEL_4}
                text={`${t('show_more')}...`}
              />
            </TouchableOpacity>
          </Text>
        )}
      </View>
      <View>
        <CustomCheckBox checked={isChecked} onChange={onChangeHandler} />
      </View>
    </View>
  );
};

export default memo(SubChallenge);

const styles = StyleSheet.create({
  SubChallenge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    ...globalStyles.simpleShadowOpacity,
  },
  nomerWrapper: {
    alignItems: 'center',
    width: 'auto',
  },
  description: {
    color: '#B6B6BD',
  },
  textWrapper: {
    width: horizontalScale(191),
  },
  title: {
    marginBottom: horizontalScale(10),
  },
  showMore: {
    textDecorationLine: 'underline',
    left: horizontalScale(4),
    top: verticalScale(2),
  },
  showLess: {
    textDecorationLine: 'underline',
  },
});
