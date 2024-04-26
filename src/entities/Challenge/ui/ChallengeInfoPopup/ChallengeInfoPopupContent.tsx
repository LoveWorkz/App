import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {ArranKennedyBlock} from '@src/shared/ui/ArranKennedyBlock/ArranKennedyBlock';

interface ChallengeInfoPopupContentProps {
  text: infoTextType[];
  onBtnPressHandler: () => void;
}

export const ChallengeInfoPopupContent = memo(
  (props: ChallengeInfoPopupContentProps) => {
    const {text = [], onBtnPressHandler} = props;

    const {t} = useTranslation();

    return (
      <>
        <ArranKennedyBlock />
        <View style={styles.texts}>
          {text.map((item, i) => {
            return (
              <View key={i.toString()} style={styles.textItem}>
                <AppText
                  weight={'600'}
                  size={TextSize.LEVEL_2}
                  text={item.text}
                />
              </View>
            );
          })}
        </View>
        <Button
          style={styles.btn}
          theme={ButtonTheme.CLEAR}
          onPress={onBtnPressHandler}>
          <AppText
            style={styles.btnText}
            size={TextSize.LEVEL_2}
            weight={'600'}
            text={t('Ok. I’ve got this')}
          />
        </Button>
      </>
    );
  },
);

const styles = StyleSheet.create({
  texts: {
    marginTop: verticalScale(20),
  },
  textItem: {
    marginBottom: verticalScale(20),
  },
  btn: {
    width: '100%',
  },
  btnText: {
    textDecorationLine: 'underline',
  },
});
