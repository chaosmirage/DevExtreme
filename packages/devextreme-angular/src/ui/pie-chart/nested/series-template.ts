/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { PieChartSeries } from 'devextreme/viz/pie_chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-pie-chart-series-template',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPieChartSeriesTemplateComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeSeries(): ((seriesName: any) => PieChartSeries) {
        return this._getOption('customizeSeries');
    }
    set customizeSeries(value: ((seriesName: any) => PieChartSeries)) {
        this._setOption('customizeSeries', value);
    }

    @Input()
    get nameField(): string {
        return this._getOption('nameField');
    }
    set nameField(value: string) {
        this._setOption('nameField', value);
    }


    protected get _optionPath() {
        return 'seriesTemplate';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoPieChartSeriesTemplateComponent
  ],
  exports: [
    DxoPieChartSeriesTemplateComponent
  ],
})
export class DxoPieChartSeriesTemplateModule { }
