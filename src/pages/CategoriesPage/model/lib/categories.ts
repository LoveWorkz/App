import {TFunction} from 'i18next';

import {CategoryKey} from '@src/entities/Category';
import {CongratsModalContentType} from '@src/widgets/CongratsModal';

export const getCongratsModalContent = (
  t: TFunction,
): Record<CategoryKey, CongratsModalContentType> => {
  const title = t('questions.congrats_for_reached_next_category');
  return {
    Starter: {
      title: `${title} Starter:`,
      description: `${t('questions.reward_challanges')} Bronze`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FBronze.png?alt=media&token=0b505bef-7ede-491b-bf41-9674c5579be9&_gl=1*143fuh2*_ga*Njk2NjAzNDE1LjE2Nzk2NTU4MjY.*_ga_CW55HF8NVT*MTY4NjIwNDI5My4yOS4xLjE2ODYyMDQ1NTEuMC4wLjA.',
    },
    Basic: {
      title: `${title} Basic:`,
      description: `${t('questions.reward_challanges')} Silver`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FSilver.png?alt=media&token=0e51447a-ff1f-4a82-9b25-59b3b9601abd',
    },
    Deep: {
      title: `${title} Deep:`,
      description: `${t('questions.reward_challanges')} Gold`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FGold.png?alt=media&token=7f267e09-81be-4003-a147-0e2af70f7084',
    },
    Intimate: {
      title: `${title} Intimate:`,
      description: `${t('questions.reward_challanges')} Diamond`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FDiamond.png?alt=media&token=00172a85-e790-4ee7-82cc-d76c6d98be8d',
    },
    Hot: {
      title: `${title} Hot:`,
      description: `${t('questions.reward_challanges')} Platinum`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FPlatinum.png?alt=media&token=19e20e96-dce7-4d69-97c4-f7a73e75eca3',
    },
    All_In_One: {
      title: `${title} All In One:`,
      description: `${t('questions.reward_challanges')} Platinum`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FPlatinum.png?alt=media&token=19e20e96-dce7-4d69-97c4-f7a73e75eca3',
    },
  };
};
