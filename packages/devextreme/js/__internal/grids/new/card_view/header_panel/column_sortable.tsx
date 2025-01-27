import $ from '@js/core/renderer';
import type { ComponentType, InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

import type { Column } from '../../grid_core/columns_controller/types';
import type { Props as SortableProps } from '../../grid_core/inferno_wrappers/sortable';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';

export type Status = 'forbid' | 'show' | 'moving' | 'none';

export interface Props extends Omit<SortableProps, 'onAdd' | 'onReorder' | 'dragTemplate'> {
  source: string;

  visibleColumns: Column[];

  allowColumnReordering: boolean;

  onMove: (column: Column, toIndex: number, source: string) => void;

  dragTemplate?: ComponentType<{ column: Column; status: Status }>;
}

interface State {
  status: Status;
}

export class ColumnSortable extends Component<Props, State> {
  status: Status = 'moving';

  dragItemProps?: {
    container: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any;
  };

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

  private readonly onDragMove = (e): void => {
    const containerCoords = $(e.element).get(0).getBoundingClientRect();
    const dragCoords = {
      x: e.event.clientX,
      y: e.event.clientY,
    };

    const yDistance = Math.min(
      Math.abs(dragCoords.y - containerCoords.y),
      Math.abs(dragCoords.y - containerCoords.y + containerCoords.height),
    );

    if (yDistance <= 64) {
      this.status = 'moving';
    } else {
      this.status = 'forbid';
    }

    this.renderDragTemplate();
  };

  private readonly onDragChange = (e): void => {
    if (this.status === 'forbid') {
      e.cancel = true;
    }
  };

  private readonly onMove = (e): void => {
    this.props.onMove(
      e.itemData.column,
      e.toIndex,
      e.itemData.source,
    );
  };

  // TODO: move all none-native approaches to sortable wrapper
  private readonly renderDragTemplate = (): void => {
    if (this.dragItemProps) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const DragTemplate = this.props.dragTemplate!;
      render(
        // @ts-expect-error
        <DragTemplate
          column={this.dragItemProps.props.itemData.column}
          status={this.status}
        />,
        this.dragItemProps.container,
      );
    }
  };

  render(): InfernoNode {
    if (!this.props.allowColumnReordering) {
      return this.props.children;
    }

    const {
      source,
      visibleColumns,
      dragTemplate,
      ...restProps
    } = this.props;

    const sortableDragTemplate = dragTemplate ? (e, container): void => {
      this.dragItemProps = {
        props: e,
        // @ts-expect-error
        container: $(container).get(0),
      };
      this.renderDragTemplate();
    } : undefined;

    return (
      <Sortable
        {...restProps}
        dropFeedbackMode='indicate'
        onDragStart={this.onDragStart}
        group='dx-cardview-columns'
        onAdd={this.onMove}
        onReorder={this.onMove}
        onDragMove={this.onDragMove}
        onDragChange={this.onDragChange}
        dragTemplate={sortableDragTemplate}
      >
      {this.props.children}
    </Sortable>
    );
  }
}
