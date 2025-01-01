import * as Toolbar from '@ts/grids/new/grid_core/toolbar/index';

import { NewDataController } from './data_controller/new_data_controller';

export const newModule = {
  defaultOptions() {
    return {
    };
  },
  newModules: [Toolbar.View, Toolbar.Controller, NewDataController],
};
