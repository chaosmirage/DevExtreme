/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, createRef } from 'inferno';

import type { Column } from '../../grid_core/columns_controller/types';
import { Button } from '../../grid_core/inferno_wrappers/button';
import { Popup } from '../../grid_core/inferno_wrappers/popup';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import { Item } from './item';

const CLASSES = {
  popup: 'dx-cardview-headerpanel-popup',
};

export interface DropDownButtonProps {
  columns: Column[];

  onReorder?: (fromIndex: number, toIndex: number) => void;

  onAdd?: (fromIndex: number, toIndex: number) => void;

  onRemove?: (name: string) => void;
}

interface DropDownButtonState {
  opened: boolean;
}

export class DropDownButton extends Component<DropDownButtonProps, DropDownButtonState> {
  private readonly buttonRef = createRef<HTMLDivElement>();

  private readonly popupPosition = {
    my: 'top right',
    at: 'bottom right',
    collision: 'fit flip',
    offset: { v: 3 },
    of: this.buttonRef,
  };

  state = {
    opened: false,
  };

  private readonly popupOptionChanged = ({ name, value }): void => {
    if (name === 'visible') {
      this.setState({ opened: value });
    }
  };

  public render(): JSX.Element {
    return (<>
      <Button
        elementRef={this.buttonRef}
        icon="overflow"
        onClick={(): void => { this.setState(({ opened }) => ({ opened: !opened })); }
      }
      />
      <Popup
        visible={this.state.opened}
        // @ts-expect-error
        onOptionChanged={this.popupOptionChanged}
        deferRendering={false}
        height={'auto'}
        width={'auto'}
        hideOnParentScroll={true}
        shading={false}
        dragEnabled={false}
        showTitle={false}
        fullScreen={false}
        // @ts-expect-error
        position={this.popupPosition}
        wrapperAttr={{
          class: CLASSES.popup,
        }}
      >
        <Sortable
          itemOrientation='horizontal'
          dropFeedbackMode='indicate'
          onReorder={(e): void => this.props.onReorder?.(e.fromIndex, e.toIndex)}
          onAdd={(e): void => this.props.onAdd?.(e.fromIndex, e.toIndex)}
          group='cardview'
        >
          {this.props.columns.map((column) => (
            <Item
              column={column}
              onRemove={
                (): void => this.props.onRemove?.(column.name)
              }
            />
          ))}
        </Sortable>
      </Popup>
    </>);
  }
}
