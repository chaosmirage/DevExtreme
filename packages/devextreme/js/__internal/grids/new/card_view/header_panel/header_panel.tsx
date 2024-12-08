/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import { getBoundingRect } from '@ts/core/utils/m_position';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component, createRef } from 'inferno';

import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import { DropDownButton } from './drop_down_button';
import { Item } from './item';

export const CLASSES = {
  headers: 'dx-cardview-headers',
};

export interface HeaderPanelProps {
  columns: Column[];

  onReorder?: (fromIndex: number, toIndex: number) => void;

  onAdd?: (fromIndex: number, toIndex: number) => void;

  onRemove?: (name: string) => void;
}

interface HeaderPanelState {
  shownColumnCount: number;
}

export class HeaderPanel extends Component<HeaderPanelProps, HeaderPanelState> {
  private status: 'initial' | 'shrinking' | 'normal' = 'initial';

  private normalHeight = 0;

  private readonly ref = createRef<HTMLDivElement>();

  state = {
    shownColumnCount: 1,
  };

  public render(): JSX.Element {
    const visibleColumns = this.props.columns.filter(
      (_, index) => index < this.state.shownColumnCount,
    );
    const nonVisibleColumns = this.props.columns.filter(
      (_, index) => index >= this.state.shownColumnCount,
    );

    return (
      <div className={CLASSES.headers} ref={this.ref}>
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

  private getHeight(): number {
    return getBoundingRect(this.ref.current!).height as number;
  }

  private updateShownColumns(): void {
    // eslint-disable-next-line no-undef-init
    let stateToApply: undefined | HeaderPanelState = undefined;

    switch (this.status) {
      case 'initial': {
        if (this.state.shownColumnCount !== 1) {
          throw new Error();
        }

        if (!this.props.columns.length) {
          return;
        }

        this.normalHeight = this.getHeight();
        this.status = 'shrinking';
        stateToApply = {
          shownColumnCount: this.props.columns.length,
        };
        break;
      }

      case 'shrinking': {
        if (this.getHeight() > this.normalHeight) {
          stateToApply = {
            shownColumnCount: this.state.shownColumnCount - 1,
          };
        } else {
          this.status = 'normal';
        }
        break;
      }

      case 'normal': {
        this.status = 'shrinking';
        stateToApply = {
          shownColumnCount: this.props.columns.length,
        };
        break;
      }

      default: {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
        const _: never = this.status;
      }
    }

    if (stateToApply) {
      this.setState(stateToApply);
    }
  }

  componentDidMount(): void {
    resizeObserverSingleton.observe(
      this.ref.current!,
      () => this.updateShownColumns(),
    );
  }

  componentDidUpdate(): void {
    this.updateShownColumns();
  }
}
