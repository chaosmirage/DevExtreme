/* eslint-disable consistent-return */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { isObject } from '@js/core/utils/type';

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';
import { ColumnsController } from './columns_controller';
import type { ColumnProperties, ColumnSettings } from './options';
import type { Column } from './types';
import { getColumnByIndexOrName } from './utils';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithColumnsController extends GridCore {
    public getVisibleColumns(): Column[] {
      return this.diContext.get(ColumnsController).visibleColumns.unreactive_get();
    }

    public addColumn(column: ColumnProperties): void {
      this.diContext.get(ColumnsController).addColumn(column);
    }

    public getVisibleColumnIndex(columnNameOrIndex: string | number): number {
      const columnsController = this.diContext.get(ColumnsController);
      const column = getColumnByIndexOrName(
        columnsController.columns.unreactive_get(),
        columnNameOrIndex,
      );

      return columnsController.visibleColumns.unreactive_get()
        .findIndex(
          (c) => c.name === column?.name,
        );
    }

    public deleteColumn(columnNameOrIndex: string | number): void {
      const columnsController = this.diContext.get(ColumnsController);

      const column = getColumnByIndexOrName(
        columnsController.columns.unreactive_get(),
        columnNameOrIndex,
      );

      if (!column) {
        return;
      }

      columnsController.deleteColumn(column);
    }

    public columnOption(
      columnNameOrIndex: string | number,
    ): Column;
    public columnOption(
      columnNameOrIndex: string | number,
      options: ColumnSettings,
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T,
      value: ColumnSettings[T]
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T,
      value: ColumnSettings[T]
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T
    ): Column[T];
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option?: T | ColumnSettings,
      value?: ColumnSettings[T],
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): Column | Column[T] | void {
      const columnsController = this.diContext.get(ColumnsController);

      const column = getColumnByIndexOrName(
        columnsController.columns.unreactive_get(),
        columnNameOrIndex,
      );

      if (!column) {
        return;
      }

      if (arguments.length === 1) {
        return column;
      }

      if (arguments.length === 2) {
        if (isObject(option)) {
          Object.entries(option).forEach(([optionName, optionValue]) => {
            columnsController.columnOption(
              column,
              optionName as keyof Column,
              optionValue,
            );
          });
        } else {
          return column[option as T];
        }
      }

      if (arguments.length === 3) {
        columnsController.columnOption(column, option as keyof Column, value);
      }
    }
  };
}
