import {globalStyles} from '@src/app/styles/GlobalStyle';
import {TextSectionType} from '@src/shared/ui/TextSection/TextSection';
import {t} from 'i18next';

export const title1 = {
  text: t('game_rules.title'),
  style: {
    ...globalStyles.size_32,
  },
};

export const descriptions1: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_1_text_1'),
  },
];

export const descriptions2: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_2_text_1'),
  },
];

export const descriptions3: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_3_text_1'),
  },
];

export const descriptions4: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_4_text_1'),
  },
  {
    text: t('game_rules.descriptions_4_text_2'),
  },
];

export const descriptions5: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_5_text_1'),
  },
];

export const descriptions6: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_6_text_1'),
  },
  {
    text: t('game_rules.descriptions_6_text_2'),
  },
  {
    text: t('game_rules.descriptions_6_text_3'),
  },
];

export const descriptions7: TextSectionType[] = [
  {
    text: t('game_rules.descriptions_7_text_1'),
  },
  {
    text: t('game_rules.descriptions_7_text_2'),
  },
];
