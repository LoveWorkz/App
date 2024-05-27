import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {CategoryKey} from '@src/entities/Category';
import {horizontalScale} from '@src/shared/lib/Metrics';

const levelNumbers: Partial<Record<CategoryKey, number>> = {
  [CategoryKey.Starter]: 1,
  [CategoryKey.Basic]: 2,
  [CategoryKey.Deep]: 3,
  [CategoryKey.Intimate]: 4,
};

const getLevelNamePositionStyle = (
  currentLevelKey: CategoryKey,
  baseLevelKey: CategoryKey,
) => {
  const currentLevelNumber = levelNumbers[currentLevelKey];
  const baseLevelNumber = levelNumbers[baseLevelKey];

  if (!(currentLevelNumber && baseLevelNumber)) {
    return `completed${baseLevelKey}`;
  }

  if (currentLevelNumber === baseLevelNumber) {
    return `current${baseLevelKey}`;
  }

  if (currentLevelNumber > baseLevelNumber) {
    return `completed${baseLevelKey}`;
  }

  return `upcoming${baseLevelKey}`;
};

const LevelNameItem = (props: {
  progressBarCategoryName: string;
  baseLevelKey: CategoryKey;
  progressBarCategoryKey: CategoryKey;
}) => {
  const {progressBarCategoryName, baseLevelKey, progressBarCategoryKey} = props;

  const isLevelCurrent = baseLevelKey === progressBarCategoryKey;

  const colors = useColors();

  const levelStyle = getLevelNamePositionStyle(
    progressBarCategoryKey,
    baseLevelKey,
  );

  return (
    <>
      <AppText
        style={[styles[levelStyle], {color: colors.white}]}
        weight={isLevelCurrent ? '500' : '600'}
        size={isLevelCurrent ? TextSize.LEVEL_4 : TextSize.LEVEL_2}
        text={baseLevelKey}
      />
    </>
  );
};

export default memo(observer(LevelNameItem));

const styles = StyleSheet.create<Record<string, any>>({
  // Starter
  completedStarter: {
    position: 'absolute',
    bottom: horizontalScale(110),
    left: horizontalScale(33),
    opacity: 0.8,
  },
  currentStarter: {
    position: 'absolute',
    bottom: horizontalScale(130),
    left: horizontalScale(30),
  },

  // Basic
  completedBasic: {
    position: 'absolute',
    bottom: horizontalScale(155),
    left: horizontalScale(190),
    opacity: 0.8,
  },
  currentBasic: {
    position: 'absolute',
    bottom: horizontalScale(170),
    left: horizontalScale(185),
  },
  upcomingBasic: {
    position: 'absolute',
    bottom: horizontalScale(140),
    left: horizontalScale(190),
    opacity: 0.8,
  },

  // Deep
  completedDeep: {
    position: 'absolute',
    bottom: horizontalScale(215),
    left: horizontalScale(140),
    opacity: 0.8,
  },
  currentDeep: {
    position: 'absolute',
    bottom: horizontalScale(240),
    left: horizontalScale(130),
  },
  upcomingDeep: {
    position: 'absolute',
    bottom: horizontalScale(210),
    left: horizontalScale(135),
    opacity: 0.8,
  },

  // Intimate
  currentIntimate: {
    position: 'absolute',
    bottom: horizontalScale(250),
    right: horizontalScale(85),
  },
  upcomingIntimate: {
    position: 'absolute',
    bottom: horizontalScale(215),
    right: horizontalScale(95),
    opacity: 0.8,
  },
});
