import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {verticalScale} from '@src/shared/lib/Metrics';
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

  const goToChallengesHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES);
    setVisible?.(false);
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <ChallengeCategory size={'large'} image={image} isBlocked={false} />

      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={title}
      />

      <Text style={styles.description}>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          lineHeight={20}
          align={'center'}
          text={description1}
        />
        {categoryName && (
          <AppText
            style={{color: colors.primaryTextColor}}
            size={TextSize.LEVEL_4}
            weight={'600'}
            lineHeight={20}
            align={'center'}
            text={categoryName}
          />
        )}
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          lineHeight={20}
          align={'center'}
          text={description2}
        />
      </Text>

      <View style={styles.btnGroup}>
        <Button
          style={styles.btn}
          theme={ButtonTheme.OUTLINED_GRADIENT}
          onPress={onCancelHandler}>
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('cancel')}
          />
        </Button>
        <Button
          onPress={goToChallengesHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.btn}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('challenge.title')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(observer(CongratsModal));

const btnWidth = '47%';

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(335),
  },
  title: {
    textAlign: 'center',
    marginTop: verticalScale(25),
  },
  description: {
    marginBottom: verticalScale(40),
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btn: {
    width: btnWidth,
  },
  dontShowAgaing: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
  },
});
