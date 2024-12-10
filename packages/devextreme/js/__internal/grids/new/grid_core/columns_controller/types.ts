import type { ColumnBase } from '@js/common/grids';

import type { DataObject, Key } from '../data_controller/types';

type InheritedColumnProps =
  | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'caption';

export type Column = Pick<Required<ColumnBase>, InheritedColumnProps> & {
  dataField?: string;

  name: string;

  calculateCellValue: (this: Column, data: unknown) => unknown | Promise<unknown>;

  editorTemplate?: unknown;

  fieldTemplate?: unknown;
};

export type VisibleColumn = Column & { visible: true };

export interface Cell {
  value: unknown;
  column: Column;
}

export interface DataRow {
  cells: Cell[];

  key: Key;

  data: DataObject;
}
