/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';

import { Row } from './row';

export interface ContentProps {
  items: DataRow[];
}

export const CLASSES = {
  content: 'dx-datagridnew-content',
};

export class Content extends PureComponent<ContentProps> {
  public render(): JSX.Element {
    return (
      <div
        tabIndex={0}
        className={CLASSES.content}
      >
        {this.props.items.map((item) => (
          <Row
            row={item}
          />
        ))}
      </div>
    );
  }
}
