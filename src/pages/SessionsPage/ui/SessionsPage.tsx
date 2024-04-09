import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Session} from '@src/entities/Session';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {categoryStore, CategoryKey} from '@src/entities/Category';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import sessionsPageStore from '../modal/store/SessionsPageStore';
import HeaderSection from './HeaderSection/HeaderSection';

interface SessionsPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const SessionsPage = (props: SessionsPageProps) => {
  const {route} = props;
  const isFetching = sessionsPageStore.isFetching;
  const currentCategory = categoryStore.category;
  const isCategoryAllInOne = currentCategory?.name === CategoryKey.How_To_Use;
  const categories = categoriesStore.categories;

  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions get the actual data
      if (isPreviousScreenQuestions) {
        sessionsPageStore.init({isCategoryAllInOne, language});
      }
    }, [isPreviousScreenQuestions, isCategoryAllInOne, language]),
  );

  useEffect(() => {
    sessionsPageStore.init({isCategoryAllInOne, language});
  }, [isCategoryAllInOne, language]);

  return (
    <View style={styles.SessionsPage}>
      <HeaderSection categories={categories} />
      <Session
        isFetching={isFetching}
        isCategoryAllInOne={isCategoryAllInOne}
      />
    </View>
  );
};

export default memo(observer(SessionsPage));

const styles = StyleSheet.create({
  SessionsPage: {
    flex: 1,
    marginTop: -globalPadding,
  },
});
