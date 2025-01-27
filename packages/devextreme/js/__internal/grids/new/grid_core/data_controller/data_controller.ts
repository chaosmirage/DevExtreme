/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataSource } from '@js/common/data';
import ArrayStore from '@js/common/data/array_store';
import type { SubsGets } from '@ts/core/reactive/index';
import {
  computed, effect, state,
} from '@ts/core/reactive/index';
import { createPromise } from '@ts/core/utils/promise';

// import { EditingController } from '../editing/controller';
// import type { Change } from '../editing/types';
import { OptionsController } from '../options_controller/options_controller';
import type { DataObject, Key } from './types';
import {
  getLocalLoadOptions,
  getStoreLoadOptions,
  isCustomStore,
  isLocalStore,
  normalizeDataSource,
  normalizeLocalOptions,
  normalizeRemoteOptions,
  updateItemsImmutable,
} from './utils';

export class DataController {
  private readonly pendingLocalOperations = {};

  private readonly loadedPromise = createPromise<void>();

  private readonly dataSourceConfiguration = this.options.oneWay('dataSource');

  private readonly keyExpr = this.options.oneWay('keyExpr');

  public readonly dataSource = computed(
    (dataSourceLike, keyExpr) => normalizeDataSource(dataSourceLike, keyExpr),
    [this.dataSourceConfiguration, this.keyExpr],
  );

  // TODO
  private readonly cacheEnabled = this.options.oneWay('cacheEnabled');

  private readonly pagingEnabled = this.options.twoWay('paging.enabled');

  public readonly pageIndex = this.options.twoWay('paging.pageIndex');

  public readonly pageSize = this.options.twoWay('paging.pageSize');

  private readonly remoteOperations = this.options.oneWay('remoteOperations');

  private readonly onDataErrorOccurred = this.options.action('onDataErrorOccurred');

  private readonly _items = state<DataObject[]>([]);

  public readonly items: SubsGets<DataObject[]> = this._items;

  private readonly _totalCount = state(0);

  public readonly totalCount: SubsGets<number> = this._totalCount;

  public readonly isLoading = state(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly filter = this.options.twoWay('filterValue');

  // public itemsWithChanges = computed(
  //   (items, changes: Change[] | undefined) => items.map((item) => (changes ?? []).filter(
  //     (change) => change.key === this.getDataKey(item),
  //   ).reduce((p, v) => ({
  //     // @ts-expect-error
  //     ...item, ...v.data,
  //   }), item)),
  //   [this.items, this.editing.changes],
  // );

  public readonly pageCount = computed(
    (totalCount, pageSize) => Math.ceil(totalCount / pageSize),
    [this.totalCount, this.pageSize],
  );

  private readonly normalizedRemoteOptions = computed(
    (remoteOperations, dataSource) => {
      const store = dataSource.store();
      return normalizeRemoteOptions(remoteOperations, isLocalStore(store), isCustomStore(store));
    },
    [this.remoteOperations, this.dataSource],
  );

  private readonly normalizedLocalOperations = computed(
    (normalizedRemoteOperations) => normalizeLocalOptions(normalizedRemoteOperations),
    [this.normalizedRemoteOptions],
  );

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    effect(
      (dataSource) => {
        const changedCallback = (e?): void => {
          this.onChanged(dataSource, e);
        };
        const loadingChangedCallback = (): void => {
          this.isLoading.update(dataSource.isLoading());
        };
        const loadErrorCallback = (error: string): void => {
          const callback = this.onDataErrorOccurred.unreactive_get();
          callback({ error });
          changedCallback();
        };
        const customizeStoreLoadOptionsCallback = (e): void => {
          const localOptions = this.normalizedLocalOperations.unreactive_get();
          this.pendingLocalOperations[e.operationId] = getLocalLoadOptions(
            e.storeLoadOptions,
            localOptions,
          );
          e.storeLoadOptions = getStoreLoadOptions(
            e.storeLoadOptions,
            localOptions,
          );
        };

        const dataLoadedCallback = (e): void => {
          /*
            We use Deffered here because the code below is synchronous.
            customizeLoadResult callback does not support async code.
          */
          new ArrayStore(e.data).load(this.pendingLocalOperations[e.operationId]).done((data) => {
            e.data = data;
          }).fail((error) => {
            // @ts-expect-error
            e.data = new Deferred().reject(error);
          });
          this.pendingLocalOperations[e.operationId] = undefined;
        };

        if (dataSource.isLoaded()) {
          changedCallback();
        }
        dataSource.on('changed', changedCallback);
        dataSource.on('loadingChanged', loadingChangedCallback);
        dataSource.on('loadError', loadErrorCallback);

        // @ts-expect-error
        dataSource.on('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
        // @ts-expect-error
        dataSource.on('customizeLoadResult', dataLoadedCallback);

        return (): void => {
          dataSource.off('changed', changedCallback);
          dataSource.off('loadingChanged', loadingChangedCallback);
          dataSource.off('loadError', loadErrorCallback);

          // @ts-expect-error
          dataSource.off('customizeStoreLoadOptions', customizeStoreLoadOptionsCallback);
          // @ts-expect-error
          dataSource.off('customizeLoadResult', dataLoadedCallback);
        };
      },
      [this.dataSource],
    );

    effect(
      () => {
        if (this.dataSource.unreactive_get().isLoaded()) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.dataSource.unreactive_get().load();
        }
      },
      [this.normalizedRemoteOptions],
    );

    effect(
      (dataSource, pageIndex, pageSize, filter, pagingEnabled) => {
        let someParamChanged = false;
        if (dataSource.pageIndex() !== pageIndex) {
          dataSource.pageIndex(pageIndex);
          someParamChanged ||= true;
        }
        if (dataSource.pageSize() !== pageSize) {
          dataSource.pageSize(pageSize);
          someParamChanged ||= true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        if (dataSource.requireTotalCount() !== true) {
          dataSource.requireTotalCount(true);
          someParamChanged ||= true;
        }
        if (dataSource.filter() !== filter) {
          dataSource.filter(filter);
          someParamChanged ||= true;
        }
        if (dataSource.paginate() !== pagingEnabled) {
          dataSource.paginate(pagingEnabled);
          someParamChanged ||= true;
        }

        if (someParamChanged || !dataSource.isLoaded()) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          dataSource.load();
        }
      },
      [this.dataSource, this.pageIndex, this.pageSize, this.filter, this.pagingEnabled],
    );
  }

  private onChanged(dataSource: DataSource, e): void {
    let items = dataSource.items() as DataObject[];

    if (e?.changes) {
      items = this._items.unreactive_get();
      items = updateItemsImmutable(items, e.changes, dataSource.store());
    }

    this._items.update(items);
    this.pageIndex.update(dataSource.pageIndex());
    this.pageSize.update(dataSource.pageSize());
    this._totalCount.update(dataSource.totalCount());
    this.loadedPromise.resolve();
  }

  public getDataKey(data: DataObject): Key {
    return this.dataSource.unreactive_get().store().keyOf(data);
  }

  public waitLoaded(): Promise<void> {
    return this.loadedPromise.promise;
  }
}
