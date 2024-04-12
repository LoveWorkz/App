import {useTranslation} from 'react-i18next';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

export const useLanguage = () => {
  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;
  return language;
};
