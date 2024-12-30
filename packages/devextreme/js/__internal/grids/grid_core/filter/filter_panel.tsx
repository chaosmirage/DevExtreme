import { Component } from 'inferno';

import { CheckBox } from '../../new/grid_core/inferno_wrappers/checkbox';

type AddWidgetPrefix = (className: string) => string;

export interface Props {
  hasFilterValue: boolean;

  addWidgetPrefix: AddWidgetPrefix;

  tabIndex: number;

  text: string;

  showFilterBuilder: () => void;

  filterEnabledHint: string;

  clearFilterText: string;

  filterEnabled: boolean;

  onFilterEnabledChange: (value: boolean) => void;

  clearFilter: () => void;
}

const UNPREFIXED_CLASSES = {
  text: 'filter-panel-text',
  checkbox: 'filter-panel-checkbox',
  clearFilter: 'filter-panel-clear-filter',
  leftContainer: 'filter-panel-left',
};

function getClasses(
  addWidgetPrefix: AddWidgetPrefix,
): typeof UNPREFIXED_CLASSES {
  return {
    text: addWidgetPrefix(UNPREFIXED_CLASSES.text),
    checkbox: addWidgetPrefix(UNPREFIXED_CLASSES.checkbox),
    clearFilter: addWidgetPrefix(UNPREFIXED_CLASSES.clearFilter),
    leftContainer: addWidgetPrefix(UNPREFIXED_CLASSES.leftContainer),
  };
}

export class FilterPanel extends Component<Props> {
  public render(): JSX.Element {
    const classes = getClasses(this.props.addWidgetPrefix);

    return (
      <>
        <div className={classes.leftContainer}>
          {this.props.hasFilterValue && (
            <CheckBox
              elementAttr={{
                class: classes.checkbox,
              }}
              hint={this.props.filterEnabledHint}
              value={this.props.filterEnabled}
              onValueChanged={(e): void => { this.props.onFilterEnabledChange(e.value); }}
            />
          )}
          <div
            onClick={(): void => this.props.showFilterBuilder()}
            tabIndex={this.props.tabIndex}
            className="dx-icon-filter"
          />
          <div
            className={classes.text}
            onClick={(): void => this.props.showFilterBuilder()}
            tabIndex={this.props.tabIndex}
          >
            {this.props.text}
          </div>
        </div>
        {this.props.hasFilterValue && (
          <div
            className={classes.clearFilter}
            onClick={(): void => this.props.clearFilter()}
            tabIndex={this.props.tabIndex}
          >
            {this.props.clearFilterText}
          </div>
        )}
      </>
    );
  }
}
