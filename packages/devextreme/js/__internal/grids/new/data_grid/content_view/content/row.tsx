import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component } from 'inferno';

export interface Props {
  row: DataRow;
}

export class Row extends Component<Props> {
  public render(): JSX.Element {
    return (
      <tr>
        {this.props.row.cells.map((cell) => (
          <td>
            {cell.text}
          </td>
        ))}
      </tr>
    );
  }
}
