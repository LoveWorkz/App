import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {TextArea} from '@src/shared/ui/TextArea/TextArea';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';

interface CompletionItemProps {
  value: string;
  onFeedbackChangeHandler: (value: string) => void;
  onSendPressHandler: () => void;
}

const FeedbackBlock = (props: CompletionItemProps) => {
  const {onFeedbackChangeHandler, value, onSendPressHandler} = props;

  const colors = useColors();

  return (
    <View>
      <TextArea
        onChange={onFeedbackChangeHandler}
        value={value}
        placeholder={
          'Any propositions or your genuine feedback will allow us to make the experience even better for you'
        }
        label={'Tell us what we can improve /Challenge idea?'}
      />
      <Button
        onPress={onSendPressHandler}
        theme={ButtonTheme.OUTLINED}
        style={[styles.btn, {backgroundColor: colors.white}]}>
        <AppText
          style={{color: colors.black}}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={'Send'}
        />
      </Button>

      <AppText
        style={[styles.skip, {color: colors.white}]}
        size={TextSize.LEVEL_4}
        align={'center'}
        weight={'600'}
        text={'Let’s skip it for now'}
      />
    </View>
  );
};

export default memo(FeedbackBlock);

const styles = StyleSheet.create({
  btn: {
    height: verticalScale(50),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  skip: {
    textDecorationLine: 'underline',
  },
});
