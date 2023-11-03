import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {CategoryKey, categoryStore} from '@src/entities/Category';
import {getCongratsModalContent} from '@src/pages/CategoriesPage';
import {
  CongratsModal,
  CongratsModalContentType,
} from '@src/widgets/CongratsModal';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import questionsStore from '../../model/store/questionsStore';

const QuestionPageCongratsModal = () => {
  const {t, i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  const currentCategory = categoryStore.category;
  const currentCategoryName = currentCategory?.name;
  const nextCategory = categoryStore.getNextCategory(currentCategory?.id);
  const isDeep = currentCategoryName === CategoryKey.Deep;

  const content =
    getCongratsModalContent(t)[currentCategoryName as CategoryKey];

  if (!(content && nextCategory)) {
    return <></>;
  }

  const contentWithCategoryName: CongratsModalContentType = {
    ...content,
    categoryName: isDeep ? '' : nextCategory.displayName[language],
  };

  return (
    <CongratsModal
      content={contentWithCategoryName}
      visible={questionsStore.congratsModalVisible}
      setVisible={questionsStore.setCongratsModalVisible}
    />
  );
};

export default memo(observer(QuestionPageCongratsModal));
