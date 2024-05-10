import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {DisplayText} from '@src/shared/types/types';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {getQuadrantsImageUrls} from '@src/entities/Session';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {QUADRANT_DETAILS_CONTENT_TOP} from '../model/lib/QuadrantDetailsPageLib';

interface QuadrantDetailsItemProps {
  step: DisplayText;
  displayName: DisplayText;
  id: string;
}

const QuadrantDetailsItem = (props: QuadrantDetailsItemProps) => {
  const {step, displayName, id} = props;
  const colors = useColors();
  const language = useLanguage();

  const textSiyle = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const source = useMemo(() => {
    const image = getQuadrantsImageUrls()[id];

    return {
      uri: image,
    };
  }, [id]);

  return (
    <>
      <View style={styles.imageWrapper}>
        <FastImage style={styles.quadrantImage} source={source} />
      </View>

      <View style={styles.content}>
        <AppText
          style={textSiyle}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={step[language]}
        />
        <View style={styles.quadrantName}>
          <AppText
            style={textSiyle}
            size={TextSize.SIZE_32}
            weight={'900'}
            text={displayName[language]}
          />
        </View>
        <AppText
          style={textSiyle}
          size={TextSize.LEVEL_5}
          weight={'700'}
          text={'The heart of everyones relationships'}
        />
      </View>
    </>
  );
};

export default memo(QuadrantDetailsItem);

const styles = StyleSheet.create({
  imageWrapper: {
    height: 470,
    width: windowWidth,
    top: 10,
  },
  quadrantImage: {
    height: '100%',
    width: '100%',
  },
  content: {
    padding: globalPadding,
    top: QUADRANT_DETAILS_CONTENT_TOP,
  },
  quadrantName: {
    marginVertical: verticalScale(5),
    maxWidth: horizontalScale(350),
  },
});
