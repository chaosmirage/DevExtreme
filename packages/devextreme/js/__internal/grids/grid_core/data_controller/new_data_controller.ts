/* eslint-disable spellcheck/spell-checker */
import type { DataSource } from '@js/common/data';
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive';
import { state } from '@ts/core/reactive/index';
import { DataController as DataControllerClass } from '@ts/grids/new/grid_core/data_controller/index';
import type { DataObject, Key } from '@ts/grids/new/grid_core/data_controller/types';

import type { DataController as OldDataController } from './m_data_controller';

type DataController = { [P in keyof DataControllerClass]: DataControllerClass[P] };

export class NewDataController implements DataController {
  public dataSource!: SubsGets<DataSource<unknown, unknown>>;

  public pageCount!: SubsGets<number>;

  public pageIndex!: SubsGetsUpd<number>;

  public pageSize!: SubsGetsUpd<number>;

  public items!: Subscribable<DataObject[]>;

  public totalCount!: Subscribable<number>;

  public isLoading!: SubsGetsUpd<boolean>;

  public filter!: SubsGetsUpd<unknown>;

  public init(oldDataController: OldDataController): void {
    const dataSource = state(oldDataController.getDataSource());
    oldDataController.dataSourceChanged.add(() => {
      dataSource.update(oldDataController.getDataSource());
    });
    this.dataSource = dataSource;

    const pageCount = state(oldDataController.pageCount());
    this.pageCount = pageCount;

    const pageSize = state(oldDataController.pageSize());
    this.pageSize = pageSize;

    const pageIndex = state(oldDataController.pageIndex());
    this.pageIndex = pageIndex;

    const totalCount = state(oldDataController.totalCount());
    this.totalCount = totalCount;

    const isLoading = state(oldDataController.isLoading());
    this.isLoading = isLoading;

    const items = state(oldDataController.items());
    // @ts-expect-error
    this.items = items;

    oldDataController.loadingChanged.add(() => {
      isLoading.update(oldDataController.isLoading());
    });

    oldDataController.changed.add(() => {
      pageCount.update(oldDataController.pageCount());
      pageSize.update(oldDataController.pageSize());
      pageCount.update(oldDataController.pageCount());
      pageIndex.update(oldDataController.pageIndex());
      items.update(oldDataController.items());
      totalCount.update(oldDataController.totalCount());
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDataKey(data: DataObject): Key {
    throw new Error('should be overwritten below');
  }
}

NewDataController.prototype.getDataKey = DataControllerClass.prototype.getDataKey;
