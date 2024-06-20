import { DataType, PredefinedTypes } from "./data_types/types";

export interface Column {
  dataField?: string;

  calculateCellValue: (data) => unknown | Promise<unknown>;

  editorTemplate: unknown;

  fieldTemplate: unknown;
}

export type ColumnSettings = Partial<Column> & {
  dataType?: PredefinedTypes | string | DataType;
}

export type ColumnConfiguration = ColumnSettings | string;
