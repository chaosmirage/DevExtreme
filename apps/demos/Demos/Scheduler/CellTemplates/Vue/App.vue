<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    v-model:current-view="currentView"
    :height="730"
    :show-all-day-panel="false"
    :first-day-of-week="0"
    :start-day-hour="9"
    :end-day-hour="19"
    data-cell-template="dataCellTemplate"
    date-cell-template="dateCellTemplate"
    time-cell-template="timeCellTemplate"
    :on-content-ready="onContentReady"
    :on-appointment-form-opening="onAppointmentFormOpening"
    :on-appointment-adding="onAppointmentAdding"
    :on-appointment-updating="onAppointmentUpdating"
  >

    <template #dataCellTemplate="{ data: cellData }">
      <DataCellMonth
        v-if="isMonthView"
        :cell-data="cellData"
      />
      <DataCell
        v-else
        :cell-data="cellData"
      />
    </template>

    <template #dateCellTemplate="{ data: cellData }">
      <DateCell
        :cell-data="cellData"
        :current-view="currentView"
      />
    </template>

    <template #timeCellTemplate="{ data: cellData }">
      <TimeCell :cell-data="cellData"/>
    </template>

  </DxScheduler>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DxScheduler, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import notify from 'devextreme/ui/notify';
import { data, holidays } from './data.ts';
import Utils from './utils.ts';
import DataCell from './DataCell.vue';
import DataCellMonth from './DataCellMonth.vue';
import DateCell from './DateCell.vue';
import TimeCell from './TimeCell.vue';

const views: DxSchedulerTypes.ViewType[] = ['workWeek', 'month'];
const currentView = ref<DxSchedulerTypes.ViewType>('workWeek');
const currentDate = new Date(2021, 3, 27);
const dataSource = data;

const isMonthView = computed(() => currentView.value === 'month');

const ariaDescription = computed(() => {
  const disabledDates = holidays
    .filter((date) => !Utils.isWeekend(date))
    .map((date) => new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  if (disabledDates?.length === 1) {
    return `${disabledDates} is a disabled date`;
  }
  if (disabledDates?.length > 1) {
    return `${disabledDates.join(', ')} are disabled dates`;
  }
});

function onContentReady(e: DxSchedulerTypes.ContentReadyEvent) {
  setComponentAria(e.component?.$element());
}

function onAppointmentFormOpening(e: DxSchedulerTypes.AppointmentFormOpeningEvent) {
  const startDate = new Date(e.appointmentData.startDate);
  if (!Utils.isValidAppointmentDate(startDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
  applyDisableDatesToDateEditors(e.form);
}
function onAppointmentAdding(e: DxSchedulerTypes.AppointmentAddingEvent) {
  const isValidAppointment = Utils.isValidAppointment(e.component, e.appointmentData);
  if (!isValidAppointment) {
    e.cancel = true;
    notifyDisableDate();
  }
}
function onAppointmentUpdating(e: DxSchedulerTypes.AppointmentUpdatingEvent) {
  const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
  if (!isValidAppointment) {
    e.cancel = true;
    notifyDisableDate();
  }
}
function notifyDisableDate() {
  notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
}
function applyDisableDatesToDateEditors(form) {
  const startDateEditor = form.getEditor('startDate');
  startDateEditor.option('disabledDates', holidays);

  const endDateEditor = form.getEditor('endDate');
  endDateEditor.option('disabledDates', holidays);
}

function setComponentAria(element) {
  const prevAria = element?.attr('aria-label') || '';
  element?.attr('aria-label', `${prevAria} ${ariaDescription.value}`);
}
</script>
