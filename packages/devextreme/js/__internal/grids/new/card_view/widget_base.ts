/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import registerComponent from '@js/core/component_registrator';
import { ContentViewContent as ContentViewContentBase } from '@ts/grids/new/grid_core/content_view/content_view_content';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget_base';

import { ContentViewContent } from './content_view/content_view_content';
import { HeadersView } from './headers/view';
import { OptionsController } from './options_controller';
import type { Properties } from './types';

class CardView extends GridCoreNew<Properties> {
  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(HeadersView);

    this.diContext.register(ContentViewContentBase, ContentViewContent);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }
}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
