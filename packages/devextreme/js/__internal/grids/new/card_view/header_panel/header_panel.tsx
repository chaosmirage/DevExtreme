/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { RefObject } from 'inferno';
import { Component } from 'inferno';

import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import { DropDownButton } from './drop_down_button';
import { Item } from './item';

export const CLASSES = {
  headers: 'dx-cardview-headers',
};

export interface HeaderPanelProps {
  columns: Column[];

  onReorder: (fromIndex: number, toIndex: number) => void;

  onAdd: (fromIndex: number, toIndex: number) => void;

  onRemove: (name: string) => void;

  shownColumnCount: number;

  elementRef: RefObject<HTMLDivElement>;
}

interface HeaderPanelState {
  shownColumnCount: number;
}

export class HeaderPanel extends Component<HeaderPanelProps, HeaderPanelState> {
  public render(): JSX.Element {
    const visibleColumns = this.props.columns.filter(
      (_, index) => index < this.props.shownColumnCount,
    );
    const nonVisibleColumns = this.props.columns.filter(
      (_, index) => index >= this.props.shownColumnCount,
    );

    return (
      <div className={CLASSES.headers} ref={this.props.elementRef}>
        <Sortable
          itemOrientation='horizontal'
          dropFeedbackMode='indicate'
          onReorder={(e): void => this.props.onReorder?.(e.fromIndex, e.toIndex)}
          onAdd={(e): void => this.props.onAdd?.(e.fromIndex, e.toIndex)}
          group='cardview'
        >
          {visibleColumns.map((column) => (
            <Item
              column={column}
              onRemove={
                (): void => this.props.onRemove?.(column.name)
              }
            />
          ))}
        </Sortable>
        {!!nonVisibleColumns.length && (
          <DropDownButton
            columns={nonVisibleColumns}
            onRemove={this.props.onRemove}
          />
        )}
      </div>
    );
  }
}
