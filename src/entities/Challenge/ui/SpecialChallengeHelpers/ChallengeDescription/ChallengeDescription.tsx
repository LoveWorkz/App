import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {verticalScale} from '@src/shared/lib/Metrics';

interface ChallengeDescriptionProps {
  description: string;
  gradientWordscount?: number;
  isMarginBottom?: boolean;
  number?: number;
}

const ChallengeDescription = (props: ChallengeDescriptionProps) => {
  const {description, gradientWordscount, isMarginBottom, number} = props;

  if (!gradientWordscount) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{marginBottom: isMarginBottom ? verticalScale(10) : 'auto'}}>
        <AppText
          align="justify"
          weight={'500'}
          size={TextSize.LEVEL_3}
          text={number ? `${number}. ${description}` : description}
        />
      </View>
    );
  }

  const firstPart = description
    .split(' ')
    .slice(0, gradientWordscount)
    .join(' ');
  const secondPart = description.split(' ').slice(gradientWordscount).join(' ');

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{marginBottom: isMarginBottom ? verticalScale(10) : 'auto'}}>
      <Text style={styles.text}>
        <TouchableOpacity>
          <GradientText
            style={styles.gradient}
            weight={'700'}
            size={TextSize.LEVEL_3}
            text={number ? `${number}. ${firstPart} ` : `${firstPart} `}
          />
        </TouchableOpacity>

        <AppText weight={'500'} size={TextSize.LEVEL_3} text={secondPart} />
      </Text>
    </View>
  );
};

export default memo(ChallengeDescription);

export const styles = StyleSheet.create({
  gradient: {
    top: verticalScale(4),
  },
  text: {
    textAlign: 'justify',
  },
});
