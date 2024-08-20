import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {TextArea} from '@src/shared/ui/TextArea/TextArea';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import completionPageStore from '../model/store/completionPageStore';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

interface CompletionItemProps {
  value: string;
  onFeedbackChangeHandler: (value: string) => void;
  onSendPressHandler: () => void;
  isSending: boolean;
}

const FeedbackBlock = (props: CompletionItemProps) => {
  const {onFeedbackChangeHandler, value, onSendPressHandler, isSending} = props;
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const colors = useColors();

  useEffect(() => {
    return () => {
      completionPageStore.clearForm();
    };
  }, []);

  return (
    <View>
      <TextArea
        onChange={onFeedbackChangeHandler}
        value={value}
        placeholder={t('common.any_proposition')}
        label={t('common.what_can_we_improve')}
      />
      <Button
        disabled={isSending}
        onPress={onSendPressHandler}
        // theme={ButtonTheme.OUTLINED}
        theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.OUTLINED}
        style={[styles.btn, isDark ? {} : {backgroundColor: colors.white}]}>
        {/* <AppText
          style={{color: colors.black}}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={t('common.send')}
        /> */}
        {isDark ? (
          <AppText
            style={{color: colors.white}}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={t('common.send')}
          />
        ) : (
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'600'}
            text={t('common.send')}
          />
        )}
      </Button>
    </View>
  );
};

export default memo(FeedbackBlock);

const styles = StyleSheet.create({
  btn: {
    height: verticalScale(50),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  skip: {
    textDecorationLine: 'underline',
  },
});
