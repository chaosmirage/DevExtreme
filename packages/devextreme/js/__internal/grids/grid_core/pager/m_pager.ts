import * as NewPagerView from '@ts/grids/new/grid_core/pager/index';

export const pagerModule = {
  defaultOptions() {
    return NewPagerView.defaultOptions;
  },
  newModules: [NewPagerView.View],
};
