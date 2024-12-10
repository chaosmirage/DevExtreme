import { captionize } from '@js/core/utils/inflector';
import { isDefined } from '@js/core/utils/type';

import type { WithOptional } from '../types';
import { type ColumnProperties, defaultColumnProperties, defaultColumnPropertiesByDataType } from './options';
import type { Column } from './types';

function normalizeColumn(column: ColumnProperties, index: number): WithOptional<Column, 'visibleIndex'> {
  let col = column;

  if (typeof col === 'string') {
    col = { dataField: col };
  }

  const dataTypeDefault = defaultColumnPropertiesByDataType[
    col.dataType ?? defaultColumnProperties.dataType
  ];

  const name = col.name ?? col.dataField ?? `column${index}`;
  const caption = captionize(name);

  return {
    ...defaultColumnProperties,
    ...dataTypeDefault,
    name,
    caption,
    ...col,
  };
}

export function getVisibleIndexes(
  indexes: (number | undefined)[],
): number[] {
  const newIndexes = [...indexes];
  let minNonExistingIndex = 0;

  indexes.forEach((visibleIndex, index) => {
    while (newIndexes.includes(minNonExistingIndex)) {
      minNonExistingIndex += 1;
    }

    newIndexes[index] = visibleIndex ?? minNonExistingIndex;
  });

  return newIndexes as number[];
}

export function normalizeVisibleIndexes(
  indexes: number[],
  forceIndex?: number,
): number[] {
  const indexMap = indexes.map(
    (visibleIndex, index) => [index, visibleIndex],
  );

  const sortedIndexMap = new Array<number>(indexes.length);
  if (isDefined(forceIndex)) {
    sortedIndexMap[indexes[forceIndex]] = forceIndex;
  }

  let j = 0;
  indexMap
    .sort((a, b) => a[1] - b[1])
    .forEach(([index]) => {
      if (index === forceIndex) {
        return;
      }

      if (isDefined(sortedIndexMap[j])) {
        j += 1;
      }

      sortedIndexMap[j] = index;
      j += 1;
    });

  const returnIndexes = new Array<number>(indexes.length);
  sortedIndexMap.forEach((index, visibleIndex) => {
    returnIndexes[index] = visibleIndex;
  });
  return returnIndexes;
}

export function normalizeColumns(columns: ColumnProperties[]): Column[] {
  const normalizedColumns = columns.map((c, i) => normalizeColumn(c, i));

  const visibleIndexes = getVisibleIndexes(
    normalizedColumns.map((c) => c.visibleIndex),
  );

  normalizedColumns.forEach((_, i) => {
    normalizedColumns[i].visibleIndex = visibleIndexes[i];
  });

  return normalizedColumns as Column[];
}

export function getColumnIndexByName(columns: Column[], name: string): number {
  return columns.findIndex((c) => c.name === name);
}
