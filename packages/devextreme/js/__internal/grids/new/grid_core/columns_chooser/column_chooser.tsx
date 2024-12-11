import { ColumnSortable } from '../../card_view/header_panel/column_sortable';
import type { Column } from '../columns_controller/types';
import { Popup } from '../inferno_wrappers/popup';
import { TreeView } from '../inferno_wrappers/tree_view';

export interface ColumnChooserProps {
  columns: Column[];

  visible: boolean;

  onMove: (column: Column) => void;
}

export function ColumnChooser(
  { visible, columns, onMove }: ColumnChooserProps,
): JSX.Element | null {
  if (!visible) {
    return null;
  }

  const items = columns.map((c) => ({
    text: c.caption,
  }));

  return (
    <Popup
      visible={visible}
      shading={false}
      dragEnabled={true}
      resizeEnabled={true}
      width={250}
      height={260}
    >
      <ColumnSortable
        filter='.dx-item'
        source='column-chooser'
        visibleColumns={columns}
        allowColumnReordering={true}
        onMove={(column): void => { onMove(column); }}
      >
        <TreeView
          items={items}
        />
      </ColumnSortable>
    </Popup>
  );
}
