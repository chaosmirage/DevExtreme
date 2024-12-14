/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import type { ErrorRowProperties } from '@ts/grids/new/grid_core/content_view/error_row';
import { ErrorRow } from '@ts/grids/new/grid_core/content_view/error_row';
import type { NoDataTextProperties } from '@ts/grids/new/grid_core/content_view/no_data_text';
import { NoDataText } from '@ts/grids/new/grid_core/content_view/no_data_text';
import { LoadPanel, type LoadPanelProperties } from '@ts/grids/new/grid_core/inferno_wrappers/load_panel';
import type { Props as ScrollableProps } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { InfernoNode, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { ContentProps } from './content/content';
import { Content } from './content/content';
import { VirtualRow } from './virtual_scrolling/virtual_row';

export const CLASSES = {
  contentView: 'dx-cardview-contentview',
};

export interface ContentViewProps {
  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };

  scrollableProps: ScrollableProps;

  contentProps: ContentProps;

  virtualScrollingProps?: {
    heightUp?: number;
    heightDown?: number;
  };

  onViewportHeightChange?: (value: number) => void;

  scrollTop?: number;

  onScroll?: (scrollTop: number) => void;

  onWidthChange?: (value: number) => void;

  scrollableRef?: RefObject<dxScrollable>;
}

export class ContentView extends Component<ContentViewProps> {
  private readonly scrollableRef = createRef<Scrollable>();

  private readonly containerRef = createRef<HTMLDivElement>();

  render(props: ContentViewProps): InfernoNode {
    return (
      <div className={CLASSES.contentView} ref={this.containerRef}>
        <LoadPanel {...props.loadPanelProps} />
        <Scrollable
          ref={this.scrollableRef}
          componentRef={this.props.scrollableRef}
          {...this.props.scrollableProps}
        >
          {props.noDataTextProps.visible && <NoDataText {...props.noDataTextProps} />}
          {
            props.virtualScrollingProps?.heightUp
              ? <VirtualRow height={props.virtualScrollingProps?.heightUp}/>
              : undefined
          }
          <Content {...props.contentProps} />
          {
            props.virtualScrollingProps?.heightDown
              ? <VirtualRow height={props.virtualScrollingProps?.heightDown}/>
              : undefined
          }
        </Scrollable>
        <ErrorRow {...props.errorRowProps} />
      </div>
    );
  }

  private updateSizesInfo(): void {
    const clientHeight = this.scrollableRef.current!.clientHeight();
    this.props?.onViewportHeightChange?.(clientHeight);
  }

  componentDidMount(): void {
    this.updateSizesInfo();
    resizeObserverSingleton.observe(
      this.containerRef.current!,
      (entry: ResizeObserverEntry) => {
        this.props.onWidthChange?.(entry.contentRect.width);
      },
    );
  }

  componentDidUpdate(): void {
    this.updateSizesInfo();
  }

  componentWillUnmount(): void {
    resizeObserverSingleton.unobserve(
      this.containerRef.current!,
    );
  }
}
