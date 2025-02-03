/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { type Subscription, SubscriptionBag } from './subscription';
import type {
  Callback, Gettable, Subscribable, Updatable,
} from './types';

export class Observable<T> implements Subscribable<T>, Updatable<T>, Gettable<T> {
  private readonly callbacks: Set<Callback<T>> = new Set();

  constructor(private value: T) {}

  update(value: T): void {
    if (this.value === value) {
      return;
    }
    this.value = value;

    this.callbacks.forEach((c) => {
      c(value);
    });
  }

  updateFunc(func: (oldValue: T) => T): void {
    this.update(func(this.value));
  }

  subscribe(callback: Callback<T>): Subscription {
    this.callbacks.add(callback);
    callback(this.value);

    return {
      unsubscribe: () => this.callbacks.delete(callback),
    };
  }

  unreactive_get(): T {
    return this.value;
  }

  dispose(): void {
    this.callbacks.clear();
  }
}

export class InterruptableComputed<
  TArgs extends readonly any[], TValue,
> extends Observable<TValue> {
  private readonly observedStatesValues: [...TArgs];

  private readonly observedStatesInitializationStates: boolean[];

  private isInitialized = false;

  private readonly subscriptionsToObservedStates = new SubscriptionBag();

  constructor(
    compute: (...args: TArgs) => TValue,
    observedStates: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
  ) {
    super(undefined as any);

    this.observedStatesValues = observedStates.map(() => undefined) as any;
    this.observedStatesInitializationStates = observedStates.map(() => false);

    observedStates.forEach((observedState, index) => {
      const observedStateChangesHandler = (value: any): void => {
        this.observedStatesValues[index] = value;

        if (!this.isInitialized) {
          this.observedStatesInitializationStates[index] = true;
        }

        // An observed state calls current handler, and the following logic updates
        // current computed's state
        // eslint-disable-next-line max-len
        this.isInitialized = this.observedStatesInitializationStates.every((isInitialized) => isInitialized);

        if (this.isInitialized) {
          this.update(compute(...this.observedStatesValues));
        }
      };

      this.subscriptionsToObservedStates.add(observedState.subscribe(observedStateChangesHandler));
    });
  }

  dispose(): void {
    super.dispose();
    this.subscriptionsToObservedStates.unsubscribe();
  }
}
