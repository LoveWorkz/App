import React, {memo} from 'react';
import {View} from 'react-native';

import {
  ChallengeCard,
  ChallengeDescription,
  ChallengeIntroCard,
} from '@src/entities/Challenge';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTranslation} from 'react-i18next';

interface TenDaysChallengeContentProps {
  data: any;
}

export const TenDaysChallengeContent = (
  props: TenDaysChallengeContentProps,
) => {
  const {data} = props;

  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  let content;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard title={data.title} description={data.description} />
      );
      break;

    case 'data_1':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescription description={data.description2[language]} />
        </ChallengeCard>
      );
      break;

    case 'data_2':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={data.description1[language]}
            isMarginBottom
          />
          <ChallengeDescription
            description={data.description2[language]}
            isMarginBottom
          />
          <ChallengeDescription description={data.description3[language]} />
        </ChallengeCard>
      );
      break;

    case 'data_3':
    case 'data_4':
      content = (
        <ChallengeCard title={data.title[language]}>
          <ChallengeDescription
            description={`${data.description1[language].replace('\\n', '\n')}`}
            gradientWordscount={1}
          />
          <ChallengeDescription
            description={data.description2[language]}
            isMarginBottom
          />

          <ChallengeDescription
            description={`${data.description3[language].replace('\\n', '\n')}`}
            gradientWordscount={1}
          />
          <ChallengeDescription
            description={data.description4[language]}
            isMarginBottom
          />

          <ChallengeDescription
            description={`${data.description5[language].replace('\\n', '\n')}`}
            gradientWordscount={1}
          />
          <ChallengeDescription
            description={data.description6[language]}
            isMarginBottom
          />

          <ChallengeDescription
            description={`${data.description7[language].replace('\\n', '\n')}`}
            gradientWordscount={1}
          />
          <ChallengeDescription
            description={data.description8[language]}
            isMarginBottom
          />

          <ChallengeDescription
            description={`${data.description9[language].replace('\\n', '\n')}`}
            gradientWordscount={1}
          />
          <ChallengeDescription description={data.description10[language]} />
        </ChallengeCard>
      );
      break;

    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(TenDaysChallengeContent);
