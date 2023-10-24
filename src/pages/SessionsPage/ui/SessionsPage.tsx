import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {PresSessionModal, SessionsList} from '@src/entities/Session';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import sessionsPageStore from '../modal/store/SessionsPageStore';

interface SessionsPageProps {
  route?: {params: {id: string}};
}

const SessionsPage = (props: SessionsPageProps) => {
  const {route} = props;
  const id = route?.params.id;
  const isFetching = sessionsPageStore.isFetching;

  const colors = useColors();
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    sessionsPageStore.init(id);
  }, [id]);

  const onPressHandler = () => {
    setVisible(true);
  };

  return (
    <View style={styles.SessionsPage}>
      <SessionsList categoryId={id} isFetching={isFetching} />
      <PresSessionModal visible={visible} setVisible={setVisible} />

      <Button
        disabled={isFetching}
        onPress={onPressHandler}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={t('start_game')}
        />
      </Button>
    </View>
  );
};

export default memo(observer(SessionsPage));

const styles = StyleSheet.create({
  SessionsPage: {
    flex: 1,
  },
  btn: {
    marginTop: verticalScale(20),
  },

  btnSkeleton: {
    width: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
  },
});
