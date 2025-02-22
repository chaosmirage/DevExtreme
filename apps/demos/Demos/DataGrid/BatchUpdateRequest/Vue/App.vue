<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="ordersStore"
    :show-borders="true"
    :remote-operations="true"
    :repaint-changes-only="true"
    @saving="onSaving"
  >
    <DxEditing
      mode="batch"
      :allow-adding="true"
      :allow-deleting="true"
      :allow-updating="true"
    />
    <DxPager :visible="true"/>
    <DxColumn
      data-field="OrderID"
      :allow-editing="false"
    />
    <DxColumn data-field="ShipName"/>
    <DxColumn data-field="ShipCountry"/>
    <DxColumn data-field="ShipCity"/>
    <DxColumn data-field="ShipAddress"/>
    <DxColumn
      data-field="OrderDate"
      data-type="date"
    />
    <DxColumn data-field="Freight"/>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxEditing, DxDataGridTypes, DxPager,
} from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import 'whatwg-fetch';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridBatchUpdateWebApi';

const ordersStore = createStore({
  key: 'OrderID',
  loadUrl: `${URL}/Orders`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const onSaving = (e: DxDataGridTypes.SavingEvent) => {
  e.cancel = true;

  if (e.changes.length) {
    e.promise = processBatchRequest(`${URL}/Batch`, e.changes, e.component);
  }
};

async function processBatchRequest(
  url: string, changes: DxDataGridTypes.DataChange[], component: DxDataGrid['instance'],
) {
  await sendBatchRequest(url, changes);
  await component.refresh(true);

  component.cancelEditData();
}

async function sendBatchRequest(url: string, changes: DxDataGridTypes.DataChange[]) {
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(changes),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    credentials: 'include',
  });

  if (!result.ok) {
    const json = await result.json();

    throw json.Message;
  }
}
</script>
<style scoped>
#gridContainer {
  height: 440px;
}
</style>
