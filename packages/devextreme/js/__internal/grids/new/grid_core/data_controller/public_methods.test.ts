import {
  describe, expect, it, jest,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import ArrayStore from '@ts/data/m_array_store';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';
import { PublicMethods } from './public_methods';

const setup = (options: Options) => {
  const optionsController = new OptionsControllerMock(options);
  const dataController = new DataController(optionsController);
  // @ts-expect-error
  const gridCore = new (PublicMethods(class {
    protected dataController = dataController;
  }))();

  return {
    optionsController,
    dataController,
    gridCore,
  };
};

describe('PublicMethods', () => {
  describe('getDataSource', () => {
    describe('when dataSource option is dataSource instance', () => {
      it('should return value from option', () => {
        const dataSource = new DataSource({
          store: [{ a: 1 }, { b: 2 }],
        });

        const { gridCore } = setup({ dataSource });

        expect(gridCore.getDataSource()).toBe(dataSource);
      });
    });
    describe('when dataSource option is array', () => {
      it('should return created DataSource', () => {
        const data = [{ a: 1 }, { b: 2 }];
        const { gridCore } = setup({ dataSource: data });

        expect(gridCore.getDataSource()).toBeInstanceOf(DataSource);
        expect(gridCore.getDataSource().items()).toEqual(data);
      });
    });
    describe('when dataSource option is empty', () => {
      it('should return empty DataSource', () => {
        const { gridCore } = setup({});

        expect(gridCore.getDataSource()).toBeInstanceOf(DataSource);
        expect(gridCore.getDataSource().items()).toHaveLength(0);
      });
    });
  });
  describe('byKey', () => {
    it('should return item by key', async () => {
      const { gridCore } = setup({
        keyExpr: 'id',
        dataSource: [
          { id: 1, value: 'value 1' },
          { id: 2, value: 'value 2' },
        ],
      });

      expect(await gridCore.byKey(1)).toEqual({ id: 1, value: 'value 1' });
      expect(await gridCore.byKey(2)).toEqual({ id: 2, value: 'value 2' });
    });

    describe('when needed item is already loaded', () => {
      it('should return item by given key without request', async () => {
        const store = new ArrayStore({
          data: [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' },
          ],
          key: 'id',
        });

        jest.spyOn(store, 'byKey');

        const { gridCore, dataController } = setup({ dataSource: store });
        await dataController.waitLoaded();

        const item = await gridCore.byKey(1);
        expect(store.byKey).toBeCalledTimes(0);
        expect(item).toEqual({ id: 1, value: 'value 1' });
      });
    });
    describe('when needed item is not already loaded', () => {
      it('should make request to get item by given key', async () => {
        const store = new ArrayStore({
          data: [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' },
          ],
          key: 'id',
        });

        jest.spyOn(store, 'byKey');

        const { gridCore, dataController } = setup({
          dataSource: store,
          paging: { pageSize: 1 },
        });
        await dataController.waitLoaded();

        const item = await gridCore.byKey(2);
        expect(store.byKey).toBeCalledTimes(1);
        expect(item).toEqual({ id: 2, value: 'value 2' });
      });
    });
  });
});
