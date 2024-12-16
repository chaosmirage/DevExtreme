/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { isString } from '@js/core/utils/type';

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';
import { ColumnsController } from './columns_controller';
import type { ColumnSettings } from './options';
import type { Column } from './types';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithColumnsController extends GridCore {
    public getVisibleColumns(): Column[] {
      return this.diContext.get(ColumnsController).visibleColumns.unreactive_get();
    }

    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number, option: T, value: ColumnSettings[T]
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number, option: T
    ): Column[T];
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T,
      value?: ColumnSettings[T],
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): Column[T] | void {
      const columnsController = this.diContext.get(ColumnsController);

      const column = columnsController.columns.unreactive_get().find((c, i) => {
        if (isString(columnNameOrIndex)) {
          return c.name === columnNameOrIndex;
        }
        return i === columnNameOrIndex;
      });

      if (!column) {
        return;
      }

      if (arguments.length === 3) {
        columnsController.columnOption(column, option, value);
      } else if (arguments.length === 2) {
        // eslint-disable-next-line consistent-return
        return column[option];
      }
    }
  };
}
