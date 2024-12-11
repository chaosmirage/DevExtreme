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

  onMove: (column: Column, toIndex: number) => void;

  onRemove: (column: Column) => void;

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
          onMove={(column, index): void => this.props.onMove?.(column, index)}
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
                (): void => this.props.onRemove?.(column)
              }
            />
            )),
          )
        }
        {!!nonVisibleColumns.length && (
          <DropDownButton
            columns={nonVisibleColumns}
            onRemove={this.props.onRemove}
            onMove={this.props.onMove}
            shownColumnCount={this.props.shownColumnCount}
            allowColumnReordering={this.props.allowColumnReordering}
          />
        )}
      </div>
    );
  }
}
