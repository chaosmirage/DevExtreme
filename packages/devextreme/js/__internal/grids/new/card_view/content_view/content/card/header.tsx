import type * as dxToolbar from '@js/ui/toolbar';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
import { Component } from 'inferno';

export const CLASSES = {
  cardHeader: 'dx-cardview-card-header',
  caption: 'dx-cardview-card-header-caption',
};

export type CardHeaderItem = dxToolbar.Item;

export interface CardHeaderProps {
  items?: CardHeaderItem[];
  visible?: boolean;
  caption?: string;
  template?: (items: CardHeaderItem[]) => JSX.Element;
  row?: DataRow;
}

export class CardHeader extends Component<CardHeaderProps> {
  render(): JSX.Element | null {
    const {
      visible = true,
      items = [],
      caption,
      template,
    } = this.props;

    if (!visible) {
      return null;
    }

    const captionItem: CardHeaderItem | null = caption
      ? {
        location: 'before',
        text: caption,
        cssClass: CLASSES.caption,
      }
      : null;

    const finalItems = captionItem ? [captionItem, ...items] : items;

    if (template) {
      return template(finalItems);
    }

    return (
      <div className={CLASSES.cardHeader}>
        <Toolbar items={finalItems} />
      </div>
    );
  }
}
