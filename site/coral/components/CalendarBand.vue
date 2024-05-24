<script setup>
import { computed } from "vue";

import dayjs from "dayjs";
import isSaneOfBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSaneOfBefore);

import CalendarMonth from "./CalendarMonth.vue";

const props = defineProps({
    modelValue: Array,
    timeframe: Object
});

const emit = defineEmits(['update:modelValue']);

const monthsSequence = computed(() => {
    const starting = props.timeframe.since;
    const ending = props.timeframe.until;
    let run = dayjs(starting);
    return [...(function* () {
        while (run.isSameOrBefore(ending, 'month')) {
            yield run;
            run = run.add(1, 'month');
        }
    })()];
});

const clickedDates = [];

function handleSelectDate(date) {
    clickedDates.push(date);
    emit('update:modelValue', clickedDates);
}

function handleHoverDate(date) {

}

function handleSelectRange([start, end]) {

}

function handleHoverRange([start, end]) {

}

</script>

<template>
<div class="calendar-band">
    <CalendarMonth v-for="month in monthsSequence" :month="month"
                   @selectDate="handleSelectDate"
                   @hoverDate="handleHoverDate"
                   @selectRange="handleSelectRange"
                   @hoverRange="handleHoverRange"/>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
.calendar-band {
    display: flex;
    gap: 1px;
    background-color: @coral-border-secondary;
    font-size: 14px;
}
</style>