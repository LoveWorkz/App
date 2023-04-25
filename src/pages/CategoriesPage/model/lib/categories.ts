import {TFunction} from 'i18next';

export const getCongratsModalContent = (t: TFunction) => {
  const title = t('questions.congrats_for_reached_next_category');
  return {
    Starter: {
      height: 150,
      width: 158,
      title: `${title} Starter:`,
      description: `${t('questions.reward_challanges')} Bronze`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fbronze.png?alt=media&token=d66edeac-9e1c-48f9-9778-30d9375256bf',
    },
    Basic: {
      height: 97,
      width: 122,
      title: `${title} Basic:`,
      description: `${t('questions.reward_challanges')} Silver`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fsilver.png?alt=media&token=a668b563-1b28-411b-bea9-49a04653c699',
    },
    Deep: {
      height: 96,
      width: 122,
      title: `${title} Deep:`,
      description: `${t('questions.reward_challanges')} Gold`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fgold.png?alt=media&token=305daa3c-ba62-474d-9156-667735e4ff58',
    },
    Intimate: {
      height: 122,
      width: 120,
      title: `${title} Intimate:`,
      description: `${t('questions.reward_challanges')} Diamond`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fdiamond.png?alt=media&token=74d4470f-465a-4c04-84c6-a816dd7732f2',
    },
    Hot: {
      height: 151,
      width: 121,
      title: `${title} Hot:`,
      description: `${t('questions.reward_challanges')} Platinum`,
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fplatinum.png?alt=media&token=fed91f9c-81ba-447e-910d-dd8b948575cb',
    },
  };
};
