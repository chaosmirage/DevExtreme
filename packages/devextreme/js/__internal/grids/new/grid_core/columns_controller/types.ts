import type { ColumnBase } from '@js/common/grids';

import type { DataObject, Key } from '../data_controller/types';

export interface Column extends Pick<Required<ColumnBase>, 'alignment' | 'dataType' | 'visible' | 'caption' | 'visibleIndex'> {
  dataField?: string;

  name: string;

  calculateCellValue: (this: this, data: unknown) => unknown | Promise<unknown>;

  editorTemplate?: unknown;

  fieldTemplate?: unknown;
}

export interface Cell {
  value: unknown;
  column: Column;
}

export interface DataRow {
  cells: Cell[];

  key: Key;

  data: DataObject;
}
