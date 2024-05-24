<script setup>

import dayjs from "dayjs";
import isSaneOfBefore from "dayjs/plugin/isSameOrBefore";
import { computed } from "vue";
import CalendarDate from "./CalendarDate.vue";

dayjs.extend(isSaneOfBefore);

const props = defineProps(['month']);
const emit = defineEmits(['select-date', 'hover-date', 'select-range', 'hover-range']);

const anchorDate = dayjs(props.month);

const datesSequence = computed(() => {
    const starting = anchorDate.startOf('month').startOf('week');
    const ending = anchorDate.endOf('month').endOf('week');
    let run = dayjs(starting);
    return [...(function* () {
        while (run.isSameOrBefore(ending, 'day')) {
            yield run;
            run = run.add(1, 'day');
        }
    })()];
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
            <CalendarDate v-for="date in datesSequence" :date="date"
                          :disabled="!date.isSame(anchorDate,'month')"
                          @selectDate="handleSelectDate"
                          @hoverDate="handleHoverDate"/>
        </div>
    </div>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
.calendar-month {
    flex: 0 0 (100%/4);
    display: flex;
    flex-direction: column;
    gap: 1px;
    .name {
        text-align: center;
        background-color: white;
        line-height: 2;
        font-weight: 600;
        cursor: pointer;
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