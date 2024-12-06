/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import { CollectionController } from '@ts/grids/new/grid_core/keyboard_navigation/collection_controller';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { InfernoNode, RefObject } from 'inferno';
import { createRef, render } from 'inferno';

import { Cover } from './cover';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FieldProps } from './field';
import { Field } from './field';
import type { CardHeaderItem } from './header';
import { CardHeader } from './header';

export const CLASSES = {
  card: 'dx-cardview-card',
  cardHover: 'dx-cardview-card-hoverable',
};

export interface CardClickEvent {
  event: MouseEvent;
  row: DataRow;
}

export interface CardHoverEvent {
  isHovered: boolean;
  row: DataRow;
}

export interface CardPreparedEvent {
  instance: Card;
}

export interface CardProps {
  row: DataRow;

  cover?: {
    altExpr?: string;

    imageExpr?: string;
  };

  elementRef?: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  hoverStateEnabled?: boolean;

  maxWidth?: number;

  minWidth?: number;

  toolbar?: CardHeaderItem[];

  width?: number;

  template?: (row: DataRow) => JSX.Element;

  onClick?: (e: CardClickEvent) => void;

  onDblClick?: (e: CardClickEvent) => void;

  onHoverChanged?: (e: CardHoverEvent) => void;

  onPrepared?: (e: CardPreparedEvent) => void;
}

export class Card extends PureComponent<CardProps> {
  private containerRef = createRef<HTMLDivElement>();

  private fieldRefs: RefObject<HTMLDivElement>[] = [];

  private readonly keyboardController = new CollectionController();

  render(): InfernoNode {
    if (this.props.elementRef) {
      this.containerRef = this.props.elementRef;
    }

    this.fieldRefs = new Array(this.props.row.cells.length).fill(undefined).map(() => createRef());

    const {
      fieldTemplate: FieldTemplate = Field,
      width,
      minWidth,
      maxWidth,
      hoverStateEnabled,
      cover,
    } = this.props;

    const style = {
      width: `${width}px`,
      'min-width': `${minWidth}px`,
      'max-width': `${maxWidth}px`,
    };

    const className = [
      CLASSES.card,
      hoverStateEnabled ? CLASSES.cardHover : '',
    ].filter(Boolean).join(' ');

    const imageSrc = cover?.imageExpr && this.props.row.data[cover.imageExpr] as string;
    const alt = cover?.altExpr && this.props.row.data[cover.altExpr] as string;

    return (
      <div
        className={className}
        tabIndex={0}
        ref={this.props.elementRef}
        onKeyDown={(e): void => this.keyboardController.onKeyDown(e)}
        onClick={this.handleClick}
        onDblClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        // TODO: move to scss
        style={style}
      >
        <CardHeader
          items={this.props.toolbar || []}
        />
          <Cover
            imageSrc={imageSrc}
            alt={alt}
          />
        {this.props.row.cells.map((cell, index) => (
          <FieldTemplate
            elementRef={this.fieldRefs[index]}
            index={index}
            // eslint-disable-next-line max-len, @typescript-eslint/explicit-function-return-type
            defaultTemplate={{ render(model, _index, container) { render(<Field {...model} />, $(container).get(0)); } }}
            alignment={cell.column.alignment}
            title={cell.column.caption || cell.column.name}
            value={cell.value}
          />
        ))}
      </div>
    );
  }

  updateKeyboardController(): void {
    this.keyboardController.container = this.containerRef.current!;
    this.keyboardController.items = this.fieldRefs.map((ref) => ref.current!);
  }

  componentDidMount(): void {
    this.updateKeyboardController();
    const { onPrepared } = this.props;
    if (onPrepared) {
      onPrepared({ instance: this });
    }
  }

  componentDidUpdate(): void {
    this.updateKeyboardController();
  }

  handleMouseEnter = (): void => {
    const { onHoverChanged, hoverStateEnabled, row } = this.props;
    if (!hoverStateEnabled) {
      return;
    }

    onHoverChanged?.({ isHovered: true, row });
  };

  handleMouseLeave = (): void => {
    const { onHoverChanged, hoverStateEnabled, row } = this.props;
    if (!hoverStateEnabled) {
      return;
    }

    onHoverChanged?.({ isHovered: false, row });
  };

  handleClick = (event: MouseEvent): void => {
    const { onClick, row } = this.props;
    onClick?.({ event, row });
  };

  handleDoubleClick = (event: MouseEvent): void => {
    const { onDblClick, row } = this.props;
    onDblClick?.({ event, row });
  };
}
