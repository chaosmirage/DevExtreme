/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DxElement } from '@js/core/element';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { Constructor } from '@ts/grids/new/grid_core/types';

import * as Base from '../../grid_core/content_view/public_methods';
import type { Key } from '../../grid_core/data_controller/types';
import type { DataGridNewBase } from '../widget';

export function PublicMethods<T extends Constructor<DataGridNewBase>>(GridCore: T) {
  return class CardViewWithContentView extends Base.PublicMethods(GridCore) {
    public getRowElement(cardIndex: number): DxElement {
      throw new Error('todo');
    }

    public getVisibleRows(): DataRow[] {
      throw new Error('todo');
    }

    public getRowIndexByKey(key: Key): number {
      throw new Error('todo');
    }

    public getKeyByRowIndex(cardIndex: number): Key {
      throw new Error('todo');
    }
  };
}
