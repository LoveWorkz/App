import {normaliseData} from '@src/shared/lib/common';

export const normaliseProducts = (data: any[]) => {
  const newDataWithId = data.map(item => {
    return {...item, id: item.productId};
  });

  return normaliseData(newDataWithId);
};
