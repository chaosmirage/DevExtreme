import * as Base from '../../grid_core/content_view/options';

export interface Options extends Base.Options {
}

export const defaultOptions = {
  ...Base.defaultOptions,
} satisfies Options;
