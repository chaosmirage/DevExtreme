/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import { hydrate } from '@devextreme/runtime/inferno';
import type { Subscription, SubsGets } from '@ts/core/reactive/index';
import { toSubscribable } from '@ts/core/reactive/index';
import { Component, type ComponentType, render } from 'inferno';

// import { renderToString } from 'inferno-server';

export abstract class View<T extends {}> {
  private inferno: undefined | ComponentType;

  private props?: T;

  private firstRender = true;

  protected abstract component: ComponentType<T>;

  protected abstract getProps(): SubsGets<T>;

  public render(root: Element): Subscription {
    const ViewComponent = this.component;
    return toSubscribable(this.getProps()).subscribe((props: T) => {
      this.props = props;
      // // @ts-expect-error
      // root.innerHTML = renderToString(<ViewComponent {...props}/>);
      if (this.firstRender) {
        this.firstRender = false;
        // @ts-expect-error
        hydrate(<ViewComponent {...props}/>, root);
      } else {
        // @ts-expect-error
        render(<ViewComponent {...props}/>, root);
      }
    });
  }

  public asInferno(): ComponentType {
    // eslint-disable-next-line no-return-assign
    return this.inferno ??= this._asInferno();
  }

  private _asInferno() {
    const view = this;

    interface State {
      props: T;
    }

    return class InfernoView extends Component<{}, State> {
      private subscription?: Subscription;

      private readonly viewProps: SubsGets<T>;

      constructor() {
        super();
        this.viewProps = view.getProps();
        this.state = {
          props: view.getProps().unreactive_get(),
        };
      }

      public render(): JSX.Element | undefined {
        const ViewComponent = view.component;
        // @ts-expect-error
        return <ViewComponent {...this.state!.props}/>;
      }

      public componentDidMount(): void {
        this.subscription = toSubscribable(this.viewProps).subscribe((props) => {
          this.state ??= {
            props,
          };

          if (this.state.props !== props) {
            this.setState({ props });
          }
        });
      }

      public componentWillUnmount(): void {
        this.subscription!.unsubscribe();
      }
    };
  }
}
