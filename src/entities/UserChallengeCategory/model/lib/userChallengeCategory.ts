const getSelectedSpecialChallengesIds = () => {
  let selectedSpecialChallengesIds = {};

  for (let i = 1; i <= 2; i++) {
    selectedSpecialChallengesIds = {
      ...selectedSpecialChallengesIds,
      [`special_challenge_${i}`]: {
        isBlocked: true,
        isSelected: false,
      },
    };
  }

  return selectedSpecialChallengesIds;
};

export const userChallengeCategoryInitData = {
  isAllChallengesSelected: false,
  isBlocked: false,
  selectedChallengesIds: [],
  selectedSpecialChallengesIds: getSelectedSpecialChallengesIds(),
};
