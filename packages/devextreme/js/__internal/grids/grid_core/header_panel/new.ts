import * as Toolbar from '@ts/grids/new/grid_core/toolbar/index';

export const toolbarModule = {
  defaultOptions() {
    return {
    };
  },
  newModules: [Toolbar.View, Toolbar.Controller],
};
