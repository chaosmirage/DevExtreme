import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Button } from '@ts/grids/new/grid_core/inferno_wrappers/button';
import type { ComponentType } from 'inferno';

export const CLASSES = {
  item: 'dx-cardview-header-item',
  button: 'dx-cardview-header-item-button',
};

export interface HeaderItemProps {
  column: Column;
  buttons?: ComponentType;
  onRemove?: () => void;
}

export function Item(props: HeaderItemProps): JSX.Element {
  return (
    <div className={CLASSES.item} tabIndex={0}>
      {props.column.caption}
      <Button
        tabIndex={-1}
        icon={props.column.visible ? 'eyeopen' : 'eyeclose'}
        stylingMode='text'
        elementAttr={{ class: CLASSES.button }}
        onClick={(): void => { props.onRemove?.(); }}
      />
    </div>
  );
}
