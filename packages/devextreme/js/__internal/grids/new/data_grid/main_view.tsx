/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { combined } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

import { ContentView } from './content_view/view';

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  FilterPanel: ComponentType;
  ColumnsChooser: ComponentType;
}

function MainViewComponent({
  Toolbar, Content, Pager, FilterPanel, ColumnsChooser,
}: MainViewProps): JSX.Element {
  return (<>
    {/* @ts-expect-error */}
    <Toolbar/>
    {/* @ts-expect-error */}
    <Content/>
    {/* @ts-expect-error */}
    <FilterPanel/>
    <div>
      {/*
        Pager, as renovated component, has strange disposing.
        See `inferno_renderer.remove` method.
        It somehow mutates $V prop of parent element.
        Without this div, CardView would be parent of Pager.
        In this case all `componentWillUnmount`s aren't called
      */}
      {/* @ts-expect-error */}
      <Pager/>
    </div>
    {/* @ts-expect-error */}
    <ColumnsChooser/>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [
    ContentView, PagerView, ToolbarView, FilterPanelView, ColumnsChooserView,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly filterPanel: FilterPanelView,
    private readonly columnsChooser: ColumnsChooserView,
  ) {
    super();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return combined({
      Toolbar: this.toolbar.asInferno(),
      Content: this.content.asInferno(),
      Pager: this.pager.asInferno(),
      FilterPanel: this.filterPanel.asInferno(),
      ColumnsChooser: this.columnsChooser.asInferno(),
    });
  }
}
