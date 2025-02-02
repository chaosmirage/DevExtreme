/* eslint-disable @typescript-eslint/ban-types */
import type * as CSS from 'csstype';
import type {
  ComponentType, VNode,
} from 'inferno';

import type { TemplateModel } from './template_wrapper';

export interface Option {
  name: string;
  fullName: string;
  value: unknown;
  previousValue: unknown;
}

export type TemplateComponent = (model: TemplateModel) => VNode;

export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithStyles {
  styles?: CSS.Properties<string | number>;
}

export interface PropsWithChildren {
  children?: JSX.Element | (JSX.Element | undefined | false | null)[];
}

export interface RefObject<T> {
  current: T | null;
}

export type JSXTemplate<
  PropsType = {},
  RequiredProps extends keyof PropsType = Exclude<
  keyof PropsType,
  keyof PropsType
  >,
  > = ComponentType<
  Partial<Omit<PropsType, RequiredProps>> &
  Required<Pick<PropsType, RequiredProps>>
  >;
