<script setup>
import { computed, provide, reactive, ref } from "vue";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import CalendarMonth from "./CalendarMonth.vue";
import { dateSequence } from "../../lib/date-util";

const props = defineProps({
    mode: String,
    selection: Array,
    timeframe: Object
});

provide('calendar-mode', props.mode);

const emit = defineEmits(['update:modelValue']);

const monthsSequence = computed(() => {
    return dateSequence([props.timeframe.since, props.timeframe.until], 1, 'month');
});

let clickedDates = reactive([]);
let hoveredDate = ref();

const displayRangeSelected = computed(() => {
    if (props.selection?.length === 2) {
        return props.selection;
    } else if (clickedDates.length === 1 && hoveredDate.value) {
        return [clickedDates[0], hoveredDate.value].sort((a, b) => a.valueOf() - b.valueOf());
    } else {
        return null;
    }
});
provide('display-range-selected', displayRangeSelected);

function handleSelectDate(date) {
    if (clickedDates.length === 2) clickedDates.splice(0);
    clickedDates.push(date);
    emit('update:selection', clickedDates.length === 2 ? clickedDates.sort((a, b) => a.valueOf() - b.valueOf()) : null);
}

function handleHoverDate(date) {
    hoveredDate.value = date;
}

function handleSelectRange([start, end]) {
    emit('update:selection', [start, end]);
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
    user-select: none;
    overflow: auto;
    display: flex;
    gap: 1px;
    background-color: @coral-border-secondary;
    font-size: 14px;
    scroll-snap-type: x mandatory;
}
</style>