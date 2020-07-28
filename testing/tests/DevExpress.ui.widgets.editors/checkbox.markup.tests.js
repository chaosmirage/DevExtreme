import $ from 'jquery';

import dxCheckBox from 'ui/check_box';
import dxrCheckBox from 'renovation/ui/check_box.j.js';
import registerComponent from 'core/component_registrator.js';
import { name as getName } from 'core/utils/public_component';
import { act } from 'preact/test-utils';

import 'common.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="checkbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container';
const CHECKBOX_CONTAINER_SELECTOR = '.dx-checkbox-container';
const ICON_SELECTOR = '.dx-checkbox-icon';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';

const createModuleConfig = (oldWidget, renovatedWidget, config) => {
    const widgetName = getName(oldWidget);
    return {
        beforeEach: function() {
            const renovatedWidgetWrapper = renovatedWidget.inherit({
                ctor: function() {
                    let res;
                    act(() => {
                        res = this.callBase.apply(this, arguments);
                    });
                    return res;
                },
                option: function() {
                    let res;
                    act(() => {
                        res = this.callBase.apply(this, arguments);
                    });
                    return res;
                },
                focus: function() {
                    let res;
                    act(() => {
                        res = this.callBase.apply(this, arguments);
                    });
                    return res;
                }
            });
            renovatedWidgetWrapper.getInstance = renovatedWidget.getInstance;
            registerComponent(widgetName, renovatedWidgetWrapper);
            config.beforeEach && config.beforeEach.apply(this);
        },
        afterEach: function() {
            config.afterEach && config.afterEach.apply(this);
            registerComponent(widgetName, oldWidget);
        }
    };
};

export const getQUnitModuleForTestingRenovationWidget = (oldWidget, newWidget) => (name, config, tests) => {
    const realConfig = tests ? config : {};
    const realTests = tests || config;
    QUnit.module(name, config, () => realTests(false));
    const newConfig = createModuleConfig(oldWidget, newWidget, realConfig);
    QUnit.module(`Renovated ${name}`, newConfig, () => realTests(true));
};

QUnit.module_r = getQUnitModuleForTestingRenovationWidget(dxCheckBox, dxrCheckBox);

QUnit.module_r('Checkbox markup', () => {
    QUnit.test('markup init', function(assert) {
        const element = $('#checkbox').dxCheckBox();

        assert.ok(element.hasClass(CHECKBOX_CLASS));

        const checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.ok(checkboxContent.hasClass(CHECKBOX_CONTAINER_CLASS), 'checkbox has a container');

        assert.equal(checkboxContent.find(ICON_SELECTOR).length, 1, 'checkbox has an icon');
    });

    QUnit.test('checkbox should have correct text', function(assert) {
        const element = $('#checkbox').dxCheckBox({
            text: 'text'
        });

        const checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.equal($.trim(checkboxContent.find('.' + CHECKBOX_TEXT_CLASS).text()), 'text');
        assert.ok(element.hasClass(CHECKBOX_HAS_TEXT_CLASS), 'checkbox with text has text class');
    });

    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#checkbox').dxCheckBox(); const $input = $element.find('input');

        assert.equal($input.length, 1, 'input is rendered');
        assert.equal($input.attr('type'), 'hidden', 'type attribute of hidden input');
    });
});

// NOTE: it's skipped for renovated widget because of bug genarator - undefined is non-selectable value
QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $element = $('#checkbox').dxCheckBox({});
        assert.equal($element.attr('role'), 'checkbox', 'aria role is correct');
    });

    QUnit.test('aria checked attributes', function(assert) {
        const $element = $('#checkbox').dxCheckBox({ value: true });
        const instance = $element.dxCheckBox('instance');

        assert.equal($element.attr('aria-checked'), 'true', 'checked state is correct');

        instance.option('value', '');
        assert.equal($element.attr('aria-checked'), 'false', 'unchecked state is correct');

        instance.option('value', undefined);
        assert.equal($element.attr('aria-checked'), 'mixed', 'mixed state is correct');
    });
});

