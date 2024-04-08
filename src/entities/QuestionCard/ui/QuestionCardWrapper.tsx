import React, {memo, useCallback, useEffect, useRef} from 'react';
import {ImageSourcePropType} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {observer} from 'mobx-react-lite';

import {RubricType} from '@src/entities/Rubric';
import {DisplayText} from '@src/shared/types/types';
import questionStore from '../model/store/questionStore';
import QuestionCard from './QuestionCard';
import {QuestionCardTypes} from '../model/types/questionTypes';

interface QuestionCardWrapperProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: QuestionCardTypes;
  id: string;
  challenge?: string;
  rubric?: RubricType;
}

const QuestionCardWrapper = (props: QuestionCardWrapperProps) => {
  const {id} = props;
  const chosenQuestionId = questionStore.question?.id;
  const isChosenQuestion = id === chosenQuestionId;

  const captureRef = useRef() as React.MutableRefObject<any>;

  const onCapture = useCallback(() => {
    setTimeout(() => {
      captureRef.current?.capture().then((uri: string) => {
        questionStore.setQuestionCardScreenshot(uri);
      });
      // calling capture after 500ms because there is some UI bug
    }, 500);
  }, []);

  useEffect(() => {
    if (isChosenQuestion) {
      onCapture();
    }
  }, [onCapture, isChosenQuestion]);

  return isChosenQuestion ? (
    <ViewShot
      ref={captureRef}
      options={{
        format: 'jpg',
        quality: 1.0,
      }}>
      <QuestionCard {...props} />
    </ViewShot>
  ) : (
    <QuestionCard {...props} />
  );
};

export default memo(observer(QuestionCardWrapper));
