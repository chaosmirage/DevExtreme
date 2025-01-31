import type { SubsGets } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import type { Props } from './headers';
import { Headers } from './headers';

export class HeadersView extends View<Props> {
  protected override component = Headers;

  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }

  protected getProps(): SubsGets<Props> {
    return combined({
      columns: this.columnsController.visibleColumns,
    });
  }
}
