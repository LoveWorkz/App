import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {RubricList} from '@src/entities/Rubric';
import rubricsPageStore from '../../model/Store/RubricsPageStore';

export const RubricsPage = () => {
  const isLoading = rubricsPageStore.isRubricsPageLoading;

  useFocusEffect(
    useCallback(() => {
      rubricsPageStore.init();
    }, []),
  );

  return (
    <View style={styles.RubricsPage}>
      <RubricList isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  RubricsPage: {
    flex: 1,
  },
});

export default memo(observer(RubricsPage));
