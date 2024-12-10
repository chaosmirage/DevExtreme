/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import type { Props } from './resizable_header_panel';
import { ResizableHeaderPanel } from './resizable_header_panel';

export class HeaderPanelView extends View<Props> {
  protected component = ResizableHeaderPanel;

  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }

  protected override getProps(): Subscribable<Props> {
    return combined({
      columns: this.columnsController.visibleColumns,
      onReorder: this.onReorder.bind(this),
      onAdd: this.onAdd.bind(this),
      onRemove: this.onRemove.bind(this),
      allowColumnReordering: this.columnsController.allowColumnReordering,
    });
  }

  public onRemove(name: string): void {
    this.columnsController.columnOption(name, 'visible', false);
  }

  public onReorder(name: string, toIndex: number): void {
    this.columnsController.columnOption(name, 'visibleIndex', toIndex);
    // const cs = this.columnsController.columns.unreactive_get();
    // const vcs = this.columnsController.visibleColumns.unreactive_get();
    // const fromIndex = cs.indexOf(vcs[visibleFromIndex]);
    // const toIndex = cs.indexOf(vcs[visibleToIndex]);

    // this.columnsController.columns.updateFunc((columns) => {
    //   const column = columns[fromIndex];
    //   const newColumns = columns.slice();
    //   newColumns.splice(fromIndex, 1);
    //   newColumns.splice(toIndex, 0, column);
    //   return newColumns;
    // });
  }

  public onAdd(name: string, toIndex: number): void {
    this.columnsController.columnOption(name, 'visible', true);
    this.columnsController.columnOption(name, 'visibleIndex', toIndex);
  }
}
