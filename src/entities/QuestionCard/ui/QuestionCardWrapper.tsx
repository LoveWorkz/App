import React, {memo} from 'react';
import {ImageSourcePropType} from 'react-native';
import {observer} from 'mobx-react-lite';

import {RubricType} from '@src/entities/Rubric';
import {DisplayText} from '@src/shared/types/types';
import {CaptureComponent} from '@src/shared/ui/CaptureComponent/CaptureComponent';
import questionStore from '../model/store/questionStore';
import QuestionCard from './QuestionCard';
import {QuestionCardTypes} from '../model/types/questionTypes';

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

  const captureHandler = (uri: string) => {
    questionStore.setQuestionCardScreenshot(uri);
  };

  return isChosenQuestion ? (
    <CaptureComponent captureHandler={captureHandler}>
      <QuestionCard {...props} />
    </CaptureComponent>
  ) : (
    <QuestionCard {...props} />
  );
};

export default memo(observer(QuestionCardWrapper));
