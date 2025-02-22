import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import { testScreenshot } from '../../../helpers/themeUtils';
import { DRAG_MOUSE_OPTIONS } from '../const';

fixture.disablePageReloads`pivotGrid_fieldPanel_drag-n-drop`
  .page(url(__dirname, '../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

test('Field panel items markup in the middle of the drag-n-drop', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnFirstAction = pivotGrid.getColumnHeaderArea().getAction();
  const rowFirstAction = pivotGrid.getRowHeaderArea().getAction();
  const dataFirstAction = pivotGrid.getDataHeaderArea().getAction();

  await MouseUpEvents.disable(MouseAction.dragToOffset);

  await t.drag(columnFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-panel_column-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(columnFirstAction, 'mouseup');

  await t.drag(rowFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-panel_row-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(columnFirstAction, 'mouseup');

  await t.drag(dataFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-panel_data-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(columnFirstAction, 'mouseup');

  await MouseUpEvents.enable(MouseAction.dragToOffset);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxPivotGrid', {
    allowSorting: true,
    allowFiltering: true,
    fieldPanel: {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowFieldDragging: true,
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        dataField: 'countA',
        area: 'row',
      }, {
        dataField: 'countB',
        area: 'row',
      }, {
        dataField: 'countC',
        area: 'data',
      }],
      store: [{
        id: 0,
        countA: 1,
        countB: 1,
        countC: 1,
        date: '2013/01/13',
      }],
    },
  });
});

test('Should show d-n-d indicator during drag to first place in columns fields', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowFirstField = pivotGrid.getRowHeaderArea().getField();
  const columnHeaderAreaElement = pivotGrid.getColumnHeaderArea().element;

  await MouseUpEvents.disable(MouseAction.dragToOffset);

  const rowFirsFieldX = await rowFirstField.offsetLeft;
  const rowFirsFieldY = await rowFirstField.offsetTop;
  const columnHeaderX = await columnHeaderAreaElement.offsetLeft;
  const columnHeaderY = await columnHeaderAreaElement.offsetTop;
  const deltaOffsetX = 20;
  const dragOffsetX = columnHeaderX - rowFirsFieldX - deltaOffsetX;
  const dragOffsetY = rowFirsFieldY - columnHeaderY;

  await t.drag(rowFirstField, dragOffsetX, dragOffsetY, DRAG_MOUSE_OPTIONS);

  await testScreenshot(t, takeScreenshot, 'field-panel_column-field_dnd-first.png', { element: pivotGrid.element });

  await MouseUpEvents.enable(MouseAction.dragToOffset);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxPivotGrid', {
    showBorders: true,
    fieldPanel: {
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'row1',
        area: 'row',
      }, {
        dataField: 'row2',
        area: 'row',
      }, {
        dataField: 'column1',
        area: 'column',
      }, {
        dataField: 'column2',
        area: 'column',
      }],
      store: [],
    },
  });
});
