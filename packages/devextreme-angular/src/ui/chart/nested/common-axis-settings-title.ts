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




import { HorizontalAlignment } from 'devextreme/common';
import { Font, TextOverflow, WordWrap } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-common-axis-settings-title',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartCommonAxisSettingsTitleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get alignment(): HorizontalAlignment {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment) {
        this._setOption('alignment', value);
    }

    @Input()
    get font(): Font {
        return this._getOption('font');
    }
    set font(value: Font) {
        this._setOption('font', value);
    }

    @Input()
    get margin(): number {
        return this._getOption('margin');
    }
    set margin(value: number) {
        this._setOption('margin', value);
    }

    @Input()
    get textOverflow(): TextOverflow {
        return this._getOption('textOverflow');
    }
    set textOverflow(value: TextOverflow) {
        this._setOption('textOverflow', value);
    }

    @Input()
    get wordWrap(): WordWrap {
        return this._getOption('wordWrap');
    }
    set wordWrap(value: WordWrap) {
        this._setOption('wordWrap', value);
    }


    protected get _optionPath() {
        return 'title';
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
    DxoChartCommonAxisSettingsTitleComponent
  ],
  exports: [
    DxoChartCommonAxisSettingsTitleComponent
  ],
})
export class DxoChartCommonAxisSettingsTitleModule { }
