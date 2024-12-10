/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { InfernoNode, RefObject } from 'inferno';
import { Component } from 'inferno';

import { ColumnSortable } from './column_sortable';
import { DropDownButton } from './drop_down_button';
import { Item } from './item';

export const CLASSES = {
  headers: 'dx-cardview-headers',
};

export interface HeaderPanelProps {
  columns: Column[];

  onReorder: (name: string, toIndex: number) => void;

  onAdd: (name: string, toIndex: number) => void;

  onRemove: (name: string) => void;

  shownColumnCount: number;

  elementRef: RefObject<HTMLDivElement>;

  allowColumnReordering: boolean;
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    const visibleColumns = this.props.columns.filter(
      (_, index) => index < this.props.shownColumnCount,
    );
    const nonVisibleColumns = this.props.columns.filter(
      (_, index) => index >= this.props.shownColumnCount,
    );

    const wrapSortable = (content: InfernoNode): InfernoNode => {
      if (!this.props.allowColumnReordering) {
        return content;
      }

      return (
        <ColumnSortable
          allowColumnReordering={this.props.allowColumnReordering}
          source='header-panel-main'
          visibleColumns={visibleColumns}
          itemOrientation='horizontal'
          onReorder={(e): void => this.props.onReorder?.(e.itemData.columnName, e.toIndex)}
          onAdd={(e): void => this.props.onAdd?.(e.itemData.columnName, e.toIndex)}
        >
          {content}
        </ColumnSortable>
      );
    };

    return (
      <div className={CLASSES.headers} ref={this.props.elementRef}>
        {
          wrapSortable(
            visibleColumns.map((column) => (
            <Item
              column={column}
              onRemove={
                (): void => this.props.onRemove?.(column.name)
              }
            />
            )),
          )
        }
        {!!nonVisibleColumns.length && (
          <DropDownButton
            columns={nonVisibleColumns}
            onRemove={this.props.onRemove}
            onAdd={this.props.onAdd}
            onReorder={this.props.onReorder}
            shownColumnCount={this.props.shownColumnCount}
            allowColumnReordering={this.props.allowColumnReordering}
          />
        )}
      </div>
    );
  }
}
