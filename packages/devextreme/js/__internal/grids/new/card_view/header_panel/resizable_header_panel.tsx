/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import { getBoundingRect } from '@ts/core/utils/m_position';
import { Component, createRef } from 'inferno';

import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export type Props = Omit<HeaderPanelProps, 'shownColumnCount' | 'elementRef'>;

interface State {
  shownColumnCount: number;
}

export class ResizableHeaderPanel extends Component<Props, State> {
  private status: 'initial' | 'shrinking' | 'normal' = 'initial';

  private normalHeight = 0;

  private readonly ref = createRef<HTMLDivElement>();

  state = {
    shownColumnCount: 1,
  };

  public render(): JSX.Element {
    return (
      <HeaderPanel
        {...this.props}
        elementRef={this.ref}
        shownColumnCount={this.state.shownColumnCount}
      />
    );
  }

  private getHeight(): number {
    return getBoundingRect(this.ref.current!).height as number;
  }

  private updateShownColumns(): void {
    // eslint-disable-next-line no-undef-init
    let stateToApply: undefined | State = undefined;

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
