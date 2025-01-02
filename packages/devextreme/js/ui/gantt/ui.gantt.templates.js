import $ from '../../core/renderer';
import { getPublicElement } from '../../core/element';

export class GanttTemplatesManager {
    constructor(gantt) {
        this._gantt = gantt;

    }

    getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
        const isTooltipShowing = true;
        const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
        const createTemplateFunction = template && ((container, item, callback) => {
            template.render({
                model: this._gantt.getTaskDataByCoreData(item),
                container: getPublicElement($(container)),
                onRendered: () => { callback(); }
            });
            return isTooltipShowing;
        });
        return createTemplateFunction;
    }

    getTaskProgressTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
        const isTooltipShowing = true;
        const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
        const createTemplateFunction = template && ((container, item, callback) => {
            template.render({
                model: item,
                container: getPublicElement($(container)),
                onRendered: () => { callback(); }
            });
            return isTooltipShowing;
        });
        return createTemplateFunction;
    }

    getTaskTimeTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
        const isTooltipShowing = true;
        const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
        const createTemplateFunction = template && ((container, item, callback) => {
            template.render({
                model: item,
                container: getPublicElement($(container)),
                onRendered: () => { callback(); }
            });
            return isTooltipShowing;
        });
        return createTemplateFunction;
    }

    getTaskContentTemplateFunc(taskContentTemplateOption) {
        const isTaskShowing = true;
        const template = taskContentTemplateOption && this._gantt._getTemplate(taskContentTemplateOption);
        const createTemplateFunction = template && ((container, item, callback, index) => {
            // callback === onTaskTemplateContainerRendered from gantt repo

            item.taskData = this._gantt.getTaskDataByCoreData(item.taskData);

            // call render from gantt

            console.log('getPublicElement($(container))', getPublicElement($(container)));
            console.log('$(container)', $(container));

            template.render({
                model: item,
                container: getPublicElement($(container)),
                onRendered: () => { callback(container, index); }
            });

            // setTimeout(() => {
            //     console.log('TIMEOUT');

            //     template.render({
            //         model: item,
            //         container: getPublicElement($(container)),
            //         onRendered: () => { callback(container, index); }
            //     });
            // }, 0)

            return isTaskShowing;
        });
        return createTemplateFunction;
    }
}
