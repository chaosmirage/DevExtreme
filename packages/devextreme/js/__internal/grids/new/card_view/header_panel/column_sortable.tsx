import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

import type { Column } from '../../grid_core/columns_controller/types';
import type { Props as SortableProps } from '../../grid_core/inferno_wrappers/sortable';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';

export interface Props extends Omit<SortableProps, 'onAdd' | 'onReorder'> {
  source: string;

  visibleColumns: Column[];

  allowColumnReordering: boolean;

  onMove: (column: Column, toIndex: number, source: string) => void;
}

export class ColumnSortable extends Component<Props> {
  private readonly onDragStart = (e): void => {
    const column = this.props.visibleColumns[e.fromIndex];

    if (!column.allowReordering) {
      e.cancel = true;
      return;
    }

    e.itemData = {
      column,
      source: this.props.source,
    };
  };

  private readonly onMove = (e): void => {
    this.props.onMove(
      e.itemData.column,
      e.toIndex,
      e.itemData.source,
    );
  };

  render(): InfernoNode {
    if (!this.props.allowColumnReordering) {
      return this.props.children;
    }

    const {
      source,
      visibleColumns,
      ...restProps
    } = this.props;

    return (
      <Sortable
        dropFeedbackMode='indicate'
        onDragStart={this.onDragStart}
        group='dx-cardview-columns'
        onAdd={this.onMove}
        onReorder={this.onMove}
        {...restProps}
      >
      {this.props.children}
    </Sortable>
    );
  }
}
