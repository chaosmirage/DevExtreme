import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component } from 'inferno';

export interface Props {
  columns: Column[];
}

export class Headers extends Component<Props> {
  public render(): JSX.Element {
    return (
      <table>
        <tr>
          {this.props.columns.map((column) => (
            <td>{column.caption}</td>
          ))}
        </tr>
      </table>
    );
  }
}
