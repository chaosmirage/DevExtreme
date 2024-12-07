/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable spellcheck/spell-checker */
import { compileGetter } from '@js/core/utils/data';
import { isDefined } from '@js/core/utils/type';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import { combined, computed, state } from '@ts/core/reactive/index';
import { OptionsController } from '@ts/grids/new/card_view/options_controller';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller';
import { ErrorController } from '@ts/grids/new/grid_core/error_controller/error_controller';
import { createRef } from 'inferno';

import type { DataObject } from '../../grid_core/data_controller/types';
import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';

export class ContentView extends View<ContentViewProps> {
  private readonly isNoData = computed(
    (isLoading, items) => !isLoading && items.length === 0,
    [this.dataController.isLoading, this.dataController.items],
  );

  public readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.visibleColumns],
  );

  public readonly scrollableRef = createRef<dxScrollable>();

  public loadingText = this.options.twoWay('loadPanel.message');

  private readonly cardMinWidth = this.options.oneWay('cardMinWidth');

  private readonly rowHeight = state(0);

  private readonly viewportHeight = state(0);

  private readonly scrollTop = state(0);

  private readonly width = state(0);

  private readonly cardsPerRow = computed(
    (width, cardMinWidth, pageSize, cardsPerRowProp) => {
      if (cardsPerRowProp !== 'auto') {
        return cardsPerRowProp;
      }

      function factors(n) {
        const res: number[] = [];
        for (let i = 1; i <= n; i += 1) if (n % i === 0) res.push(i);
        return res;
      }

      const result = factors(pageSize).reverse().find((cardsPerRow) => {
        const cardWidth = (width - 6 * (cardsPerRow - 1)) / cardsPerRow;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return cardMinWidth! <= cardWidth;
      });

      return result ?? 1;
    },
    [this.width, this.cardMinWidth, this.dataController.pageSize, this.options.oneWay('cardsPerRow')],
  );

  private readonly virtualState = computed(
    (items, scrollTop, viewportHeight, rowHeight, cardsPerRow) => {
      const scrollHeight = (items.length / cardsPerRow) * rowHeight;

      const scrollBottom = scrollHeight - viewportHeight - scrollTop;

      const nonVisibleRowCountUp = Math.floor(scrollTop / rowHeight);
      const nonVisibleRowCountBottom = Math.floor(scrollBottom / rowHeight);

      const virtualTop = nonVisibleRowCountUp * rowHeight;
      const virtualBottom = nonVisibleRowCountBottom * rowHeight;

      const virtualItems = items.slice(
        nonVisibleRowCountUp * cardsPerRow,
        items.length - nonVisibleRowCountBottom * cardsPerRow,
      );

      return {
        virtualTop,
        virtualBottom,
        virtualItems,
      };
    },
    [this.items, this.scrollTop, this.viewportHeight, this.rowHeight, this.cardsPerRow],
  );

  protected override component = ContentViewComponent;

  public static dependencies = [
    DataController, OptionsController, ErrorController, ColumnsController,
  ] as const;

  constructor(
    protected readonly dataController: DataController,
    protected readonly options: OptionsController,
    protected readonly errorController: ErrorController,
    protected readonly columnsController: ColumnsController,

  ) {
    super();
  }

  protected override getProps() {
    return combined({
      loadPanelProps: computed(
        (visible, loadPanel) => ({
          ...loadPanel,
          visible,
        }),
        [
          this.dataController.isLoading,
          this.options.oneWay('loadPanel'),
        ],
      ),
      noDataTextProps: combined({
        text: this.options.oneWay('noDataText'),
        template: this.options.template('noDataTemplate'),
        visible: this.isNoData,
      }),
      errorRowProps: combined({
        enabled: this.options.oneWay('errorRowEnabled'),
        errors: this.errorController.errors,
      }),
      contentProps: combined({
        items: this.items,
        // items: computed((virtualState) => virtualState.virtualItems, [this.virtualState]),
        fieldTemplate: this.options.template('fieldTemplate'),
        cardsPerRow: this.cardsPerRow,
        onRowHeightChange: this.rowHeight.update.bind(this.rowHeight),
        cardProps: combined({
          minWidth: this.cardMinWidth,
          maxWidth: this.options.oneWay('cardMaxWidth'),
          onClick: this.options.action('onCardClick'),
          onDblClick: this.options.action('onCardDblClick'),
          onHoverChanged: this.options.action('onCardHoverChanged'),
          onPrepared: this.options.action('onCardPrepared'),
          cover: combined({
            imageExpr: computed(
              (imageExpr) => this.processExpr(imageExpr),
              [this.options.oneWay('cardCover.imageExpr')],
            ),
            altExpr: computed(
              (altExpr) => this.processExpr(altExpr),
              [this.options.oneWay('cardCover.altExpr')],
            ),
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toolbar: this.options.oneWay('cardHeader.items') as any,
        }),
      }),
      onWidthChange: this.width.update.bind(this.width),
      virtualScrollingProps: combined({
        heightUp: 0,
        heightDown: 0,
        // heightUp: computed((virtualState) => virtualState.virtualTop, [this.virtualState]),
        // heightDown: computed((virtualState) => virtualState.virtualBottom, [this.virtualState]),
      }),
      onViewportHeightChange: this.viewportHeight.update.bind(this.viewportHeight),
      scrollableRef: this.scrollableRef,
      scrollableProps: combined({
        onScroll: this.onScroll.bind(this),
        direction: 'both' as const,
        scrollTop: this.scrollTop,
        scrollByContent: this.options.oneWay('scrolling.scrollByContent'),
        scrollByThumb: this.options.oneWay('scrolling.scrollByThumb'),
        showScrollbar: this.options.oneWay('scrolling.showScrollbar'),
        useNative: computed(
          (useNative) => (useNative === 'auto' ? undefined : useNative),
          [this.options.oneWay('scrolling.useNative')],
        ),
      }),
    });
  }

  private processExpr<T>(
    expr: T | ((data: DataObject) => T) | undefined,
  ): ((data: DataObject) => T) | undefined {
    if (!isDefined(expr)) {
      return undefined;
    }
    // @ts-expect-error
    return compileGetter(expr);
  }

  private onScroll(e: ScrollEventInfo<unknown>): void {
    this.scrollTop.update(e.scrollOffset.top);
  }
}
