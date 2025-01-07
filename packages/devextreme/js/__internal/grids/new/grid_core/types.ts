/* eslint-disable spellcheck/spell-checker */
import type { template } from '@js/core/templates/template';
import type { DIContext } from '@ts/core/di';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, TDeps extends readonly any[] = any[]> = new(...deps: TDeps) => T;

export interface WithDIContext {
  diContext: DIContext;
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Template<T> = (props: T) => HTMLDivElement | template;

export type WithOptional<T, TProp extends keyof T> = Omit<T, TProp> & Partial<Pick<T, TProp>>;
export type WithRequired<T, TProp extends keyof T> = Omit<T, TProp> & Required<Pick<T, TProp>>;
