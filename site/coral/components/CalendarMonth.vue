<script setup>

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { computed, inject } from "vue";
import CalendarDate from "./CalendarDate.vue";
import { dateSequence } from "../../lib/date-util";

dayjs.extend(isSameOrBefore);

const props = defineProps(['month']);
const emit = defineEmits(['select-date', 'hover-date', 'select-range', 'hover-range']);

const calendarMode = inject('calendar-mode');

const anchorDate = dayjs(props.month);

const datesOfMonth = computed(() => {
    return dateSequence([anchorDate.startOf('month').startOf('week'), anchorDate.endOf('month').endOf('week')]);
});

function handleSelectDate(date) {
    emit('select-date', date);
}

function handleHoverDate(date) {
    emit('hover-date', date);
}

</script>

<template>
<div class="calendar-month">
    <div class="name"
         @click="emit('select-range', [anchorDate.startOf('month'), anchorDate.endOf('month')])"
         @mouseenter="emit('hover-range', [anchorDate.startOf('month'), anchorDate.endOf('month')])">
        {{ anchorDate.format('MMMM') }}
    </div>
    <div class="dates-block">
        <div class="dates-grid">
            <span class="week-day-label">пн</span>
            <span class="week-day-label">вт</span>
            <span class="week-day-label">ср</span>
            <span class="week-day-label">чт</span>
            <span class="week-day-label">пт</span>
            <span class="week-day-label weekend">сб</span>
            <span class="week-day-label weekend">вс</span>
            <CalendarDate v-for="date in datesOfMonth" :date="date"
                          :disabled="!date.isSame(anchorDate,'month')"
                          @selectDate="handleSelectDate"
                          @hoverDate="handleHoverDate"/>
        </div>
    </div>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";
.calendar-month {
    flex: 1 0 (100%/4);
    display: flex;
    flex-direction: column;
    gap: 1px;
    scroll-snap-align: start;
    @media screen and (max-width: @strange-breakpoint) {
        flex: 1 0 (100%/3);
    }
    @media screen and (max-width: @mobile-breakpoint) {
        flex: 1 0 (100%/2);
    }
    @media screen and (max-width: @narrow-breakpoint) {
        flex: 1 0 100%;
    }
    .name {
        pointer-events: v-bind("calendarMode === 'nav' ? 'none' : 'auto' ");
        text-align: center;
        background-color: white;
        line-height: 2;
        font-weight: 600;
        cursor: pointer;
        .transit(color, .25s);
        .transit(background-color, .25s);
        &:hover {
            background-color: @coral-primary;
            color: white;
        }
    }
    .dates-block {
        flex: 1;
        background-color: white;
        padding: 0 .5em;
        .dates-grid {
            display: grid;
            grid-template-columns: repeat(7, auto);
            text-align: center;
            .week-day-label {
                line-height: 2;
                font-weight: 600;
                &.weekend {
                    color: @coral-error;
                }
            }
        }
    }
}
</style>