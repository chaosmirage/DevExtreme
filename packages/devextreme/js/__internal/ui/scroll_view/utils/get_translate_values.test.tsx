/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  describe, expect, it, jest,
} from '@jest/globals';

import { getElementTransform } from './get_element_style';
import { getTranslateValues } from './get_translate_values';

jest.mock('./get_element_style', () => ({
  ...jest.requireActual<any>('./get_element_style'),
  getElementTransform: jest.fn(() => ''),
}));

describe('getTranslateValues', () => {
  it('element is not defined', () => {
    expect(getTranslateValues(null)).toEqual({ left: 0, top: 0 });
  });

  it('matrix(1, 0, 0, 1, 10, 20)', () => {
    (getElementTransform as jest.Mock).mockReturnValue('matrix(1, 0, 0, 1, 10, 20)');
    const el = {} as HTMLElement;

    expect(getTranslateValues(el)).toEqual({ left: 10, top: 20 });
  });
});
