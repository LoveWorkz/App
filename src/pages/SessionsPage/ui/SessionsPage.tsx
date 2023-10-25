import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {SessionsList} from '@src/entities/Session';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import sessionsPageStore from '../modal/store/SessionsPageStore';

interface SessionsPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const SessionsPage = (props: SessionsPageProps) => {
  const {route} = props;
  const isFetching = sessionsPageStore.isFetching;

  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions get the actual data
      if (isPreviousScreenQuestions) {
        sessionsPageStore.init();
      }
    }, [isPreviousScreenQuestions]),
  );

  useEffect(() => {
    sessionsPageStore.init();
  }, []);

  return (
    <View style={styles.SessionsPage}>
      <SessionsList isFetching={isFetching} />
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
