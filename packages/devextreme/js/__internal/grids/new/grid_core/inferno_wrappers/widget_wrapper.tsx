import type DOMComponent from '@js/core/dom_component';
import type { InfernoNode, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

interface WithRef<TComponent> {
  componentRef?: RefObject<TComponent>;
  elementRef?: RefObject<HTMLDivElement>;
}

export abstract class InfernoWrapper<
  TProperties,
  TComponent extends DOMComponent<TProperties>,
> extends Component<TProperties & WithRef<TComponent>> {
  protected ref = createRef<HTMLDivElement>();

  protected component?: TComponent;

  protected abstract getComponentFabric(): new (
    element: Element, options: TProperties
  ) => TComponent;

  public render(): InfernoNode {
    if (this.props.elementRef) {
      this.ref = this.props.elementRef;
    }
    return <div ref={this.ref}></div>;
  }

  private updateComponentRef(): void {
    if (this.props.componentRef) {
      // @ts-expect-error
      this.props.componentRef.current = this.component;
    }
  }

  protected updateComponentOptions(prevProps: TProperties, props: TProperties): void {
    Object.keys(props as object).forEach((key) => {
      if (props[key] !== prevProps[key]) {
        this.component?.option(key, props[key]);
      }
    });
  }

  protected createComponent(ref: RefObject<HTMLDivElement>, props: TProperties): TComponent {
    // eslint-disable-next-line no-new, @typescript-eslint/no-non-null-assertion
    return new (this.getComponentFabric())(ref.current!, props);
  }

  public componentDidMount(): void {
    this.component = this.createComponent(this.ref, this.props);
    this.updateComponentRef();
  }

  public componentDidUpdate(prevProps: TProperties): void {
    this.updateComponentOptions(prevProps, this.props);
    this.updateComponentRef();
  }

  public componentWillUnmount(): void {
    this.component?.dispose();
  }
}
