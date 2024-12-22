import {TFunction} from 'i18next';

import {CategoryKey} from '@src/entities/Category';
import {CongratsModalContentType} from '@src/widgets/CongratsModal';

export const getCongratsModalContent = (
  t: TFunction,
): Partial<Record<CategoryKey, CongratsModalContentType>> => {
  return {
    Starter: {
      title: t('questions.great_job'),
      description1: t('questions.congrats_basic_description_1'),
      description2: t('questions.congrats_basic_description_2'),
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FBasic%2FBasic_small.png?alt=media&token=1314bee9-a566-4d39-8fb8-e80dafe139bc&_gl=1*85h64s*_ga*MTUxNDc1OTYxNy4xNjg1MDk4OTg3*_ga_CW55HF8NVT*MTY5ODg2NDM2NS4xNjcuMS4xNjk4ODY0NDg2LjM3LjAuMA..',
    },
    Basic: {
      title: t('questions.great_job'),
      description1: t('questions.congrats_basic_description_1'),
      description2: t('questions.congrats_basic_description_2'),
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FBasic%2FBasic_small.png?alt=media&token=1314bee9-a566-4d39-8fb8-e80dafe139bc&_gl=1*85h64s*_ga*MTUxNDc1OTYxNy4xNjg1MDk4OTg3*_ga_CW55HF8NVT*MTY5ODg2NDM2NS4xNjcuMS4xNjk4ODY0NDg2LjM3LjAuMA..',
    },
    Deep: {
      title: t('questions.fantastic_work'),
      description1: t('questions.congrats_deep_description_1'),
      description2: t('questions.congrats_deep_description_2'),
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FDeep%2FDeep_middle.png?alt=media&token=c00a8a27-ce44-476f-863b-3aff3db8d6aa&_gl=1*8k0lxh*_ga*MTUxNDc1OTYxNy4xNjg1MDk4OTg3*_ga_CW55HF8NVT*MTY5ODkzOTYzNC4xNjkuMS4xNjk4OTM5NjU1LjM5LjAuMA..',
    },
    Intimate: {
      title: t('questions.great_job'),
      description1: t('questions.congrats_intimate_description_1'),
      description2: t('questions.congrats_intimate_description_2'),
      image:
        'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FIntimate%2FIntimate_middle.png?alt=media&token=7fee4fbf-aa70-4f55-8aa7-52688731ac42&_gl=1*3jpb4h*_ga*MTUxNDc1OTYxNy4xNjg1MDk4OTg3*_ga_CW55HF8NVT*MTY5ODkzOTYzNC4xNjkuMS4xNjk4OTM5NzEwLjU3LjAuMA..',
    },
  };
};
