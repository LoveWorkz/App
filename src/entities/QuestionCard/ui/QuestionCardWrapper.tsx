import React, {memo} from 'react';
import {ImageSourcePropType, StatusBar} from 'react-native';
import {observer} from 'mobx-react-lite';

import {RubricType} from '@src/entities/Rubric';
import {DisplayText} from '@src/shared/types/types';
import {CaptureComponent} from '@src/shared/ui/CaptureComponent/CaptureComponent';
import questionStore from '../model/store/questionStore';
import QuestionCard from './QuestionCard';
import {QuestionCardTypes} from '../model/types/questionTypes';
import {useTheme} from '@src/app/providers/themeProvider';

interface QuestionCardWrapperProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: QuestionCardTypes;
  rubric?: RubricType;
  id: string;
}

const QuestionCardWrapper = (props: QuestionCardWrapperProps) => {
  const {id} = props;
  const chosenQuestionId = questionStore.question?.id;
  const isChosenQuestion = id === chosenQuestionId;
  const {isDark} = useTheme();

  const captureHandler = (uri: string) => {
    questionStore.setQuestionCardScreenshot(uri);
  };

  return isChosenQuestion ? (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <CaptureComponent captureHandler={captureHandler}>
        <QuestionCard {...props} />
      </CaptureComponent>
    </>
  ) : (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <QuestionCard {...props} />
    </>
  );
};

export default memo(observer(QuestionCardWrapper));
