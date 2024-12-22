import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {ChallengeCategory} from '@src/entities/ChallengeCategory';
import {CongratsModalContentType} from '../model/types/congratsModalType';

interface CongratsModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  content: CongratsModalContentType;
}

const CongratsModal = (props: CongratsModalProps) => {
  const {visible, setVisible, content} = props;
  const {title, description1, description2, categoryName, image} = content;
  const colors = useColors();
  const {t} = useTranslation();

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={title}
      />
      <AppText
        style={{
          marginTop: verticalScale(15),
          marginBottom: verticalScale(20),
          color: colors.primaryTextColor,
        }}
        size={TextSize.LEVEL_5}
        lineHeight={20}
        align={'center'}
        weight={'400'}
        text={description1}
      />
      <ChallengeCategory size={'large'} image={image} isBlocked={false} />

      <Text>
        {categoryName && (
          <AppText
            style={{
              marginVertical: verticalScale(8),
              color: colors.primaryTextColor,
            }}
            size={TextSize.LEVEL_7}
            weight={'600'}
            align={'center'}
            text={categoryName}
          />
        )}
      </Text>
      <AppText
        style={{marginBottom: verticalScale(5), color: colors.primaryTextColor}}
        size={TextSize.LEVEL_5}
        lineHeight={20}
        align={'center'}
        text={description2}
      />
      <Button theme={ButtonTheme.CLEAR} onPress={onCancelHandler}>
        <AppText
          style={styles.btnText}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={t('common.ok_i_got_this')}
        />
      </Button>
    </Modal>
  );
};

export default memo(observer(CongratsModal));

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(406),
    paddingVertical: verticalScale(40),
    paddingHorizontal: horizontalScale(40),
  },
  title: {
    textAlign: 'center',
    // marginTop: verticalScale(25),
  },
  btnText: {
    textDecorationLine: 'underline',
  },
});
