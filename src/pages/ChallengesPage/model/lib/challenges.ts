import {CongratsModalContentType} from '@src/widgets/CongratsModal';

export const getCongratsModalContentForChallenges = (): Record<
  string,
  CongratsModalContentType
> => {
  return {
    Bronze: {
      height: 150,
      width: 158,
      title: 'congrats you unlocked the Silver',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fsilver.png?alt=media&token=a668b563-1b28-411b-bea9-49a04653c699',
    },
    Silver: {
      height: 150,
      width: 170,
      title: 'congrats you unlocked the Gold',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fgold.png?alt=media&token=305daa3c-ba62-474d-9156-667735e4ff58',
    },
    Gold: {
      height: 150,
      width: 170,
      title: 'congrats you unlocked the Diamond',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fdiamond.png?alt=media&token=74d4470f-465a-4c04-84c6-a816dd7732f2',
    },
    Diamond: {
      height: 150,
      width: 170,
      title: 'congrats you unlocked the Platinum',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fplatinum.png?alt=media&token=fed91f9c-81ba-447e-910d-dd8b948575cb',
    },
    Platinum: {
      height: 151,
      width: 170,
      title: 'congrats you unlocked the all challenges',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2Fplatinum.png?alt=media&token=fed91f9c-81ba-447e-910d-dd8b948575cb',
    },
  };
};
