/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import { computed, iif, interruptableComputed } from '@ts/core/reactive/index';

import { DataController } from '../data_controller/index';
import type { DataObject } from '../data_controller/types';
import { OptionsController } from '../options_controller/options_controller';
import type { Column, DataRow, VisibleColumn } from './types';
import { getColumnIndexByName, normalizeColumns, normalizeVisibleIndexes } from './utils';

export class ColumnsController {
  public readonly columns: SubsGetsUpd<Column[]>;

  public readonly visibleColumns: SubsGets<Column[]>;

  public readonly nonVisibleColumns: SubsGets<Column[]>;

  public readonly allowColumnReordering: Subscribable<boolean>;

  public static dependencies = [OptionsController, DataController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
  ) {
    const columnsConfiguration = this.options.oneWay('columns');

    const columnsFromDataSource = computed(
      (items: unknown[]) => {
        if (!items.length) {
          return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(items[0] as any);
      },
      [this.dataController.items],
    );

    this.columns = interruptableComputed(
      (columnsConfiguration) => normalizeColumns(columnsConfiguration ?? []),
      [
        iif(
          computed((columnsConfiguration) => !!columnsConfiguration, [columnsConfiguration]),
          columnsConfiguration,
          columnsFromDataSource,
        ),
      ],
    );

    this.visibleColumns = computed(
      (columns) => columns
        .filter((column): column is VisibleColumn => column.visible)
        .sort((a, b) => a.visibleIndex - b.visibleIndex),
      [this.columns],
    );

    this.nonVisibleColumns = computed(
      (columns) => columns.filter((column) => !column.visible),
      [this.columns],
    );

    this.allowColumnReordering = this.options.oneWay('allowColumnReordering');
  }

  public createDataRow(data: DataObject, columns: Column[]): DataRow {
    return {
      cells: columns.map((c) => ({
        column: c,
        value: c.calculateCellValue(data),
      })),
      key: this.dataController.getDataKey(data),
      data,
    };
  }

  public columnOption<TProp extends keyof Column>(
    name: string,
    option: TProp,
    value: Column[TProp],
  ): void {
    this.columns.updateFunc((columns) => {
      const index = getColumnIndexByName(columns, name);
      const newColumns = [...columns];

      if (columns[index][option] === value) {
        return columns;
      }

      newColumns[index] = {
        ...newColumns[index],
        [option]: value,
      };

      const visibleIndexes = normalizeVisibleIndexes(
        newColumns.map((c) => c.visibleIndex),
        index,
      );

      visibleIndexes.forEach((visibleIndex, i) => {
        if (newColumns[i].visibleIndex !== visibleIndex) {
          newColumns[i] = {
            ...newColumns[i],
            visibleIndex,
          };
        }
      });

      return newColumns;
    });
  }
}
