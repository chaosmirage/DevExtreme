/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import type { Column } from '../../grid_core/columns_controller/types';
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
      onMove: this.onMove.bind(this),
      onRemove: this.onRemove.bind(this),
      allowColumnReordering: this.columnsController.allowColumnReordering,
    });
  }

  public onRemove(column: Column): void {
    this.columnsController.columnOption(column, 'visible', false);
  }

  public onMove(column: Column, toIndex: number): void {
    this.columnsController.columnOption(column, 'visible', true);
    this.columnsController.columnOption(column, 'visibleIndex', toIndex);
  }
}
