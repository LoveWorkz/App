import {ChallengeCategoryKeys} from '@src/entities/ChallengeCategory';
import {CongratsModalContentType} from '@src/widgets/CongratsModal';

export const getCongratsModalContentForChallenges = (): Record<
  ChallengeCategoryKeys,
  CongratsModalContentType
> => {
  return {
    Bronze: {
      title: 'congrats you unlocked the Silver',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FSilver.png?alt=media&token=0e51447a-ff1f-4a82-9b25-59b3b9601abd',
    },
    Silver: {
      title: 'congrats you unlocked the Gold',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FGold.png?alt=media&token=7f267e09-81be-4003-a147-0e2af70f7084',
    },
    Gold: {
      title: 'congrats you unlocked the Diamond',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FDiamond.png?alt=media&token=00172a85-e790-4ee7-82cc-d76c6d98be8d',
    },
    Diamond: {
      title: 'congrats you unlocked the Platinum',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FPlatinum.png?alt=media&token=19e20e96-dce7-4d69-97c4-f7a73e75eca3',
    },
    Platinum: {
      title: 'congrats you unlocked the all challenges',
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/challenges%2FPlatinum.png?alt=media&token=19e20e96-dce7-4d69-97c4-f7a73e75eca3',
    },
  };
};
