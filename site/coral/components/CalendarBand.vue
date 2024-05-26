<script setup>
import { computed, provide, reactive, ref } from "vue";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import CalendarMonth from "./CalendarMonth.vue";
import { dateSequence } from "../../lib/date-util";
import { useScroll } from "@vueuse/core";

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

const $el = ref();

const { arrivedState, x: scrolledX } = useScroll($el);

</script>

<template>
<div ref="$el" class="calendar-band">
    <CalendarMonth v-for="month in monthsSequence" :month="month"
                   :key="month.valueOf()"
                   @selectDate="handleSelectDate"
                   @hoverDate="handleHoverDate"
                   @selectRange="handleSelectRange"
                   @hoverRange="handleHoverRange"/>
    <Transition name="slidein-left">
        <div v-if="!arrivedState.left" :style="{ transform: `translateX(${ scrolledX }px)` }" class="lefty-ctl">
            <button>&LeftAngleBracket;&LeftAngleBracket;</button><button>&LeftAngleBracket;</button>
        </div>
    </Transition>
    <Transition name="slidein-right">
        <div v-if="!arrivedState.right" :style="{ transform: `translateX(${ scrolledX }px)` }" class="righty-ctl">
            <button>&RightAngleBracket;</button><button>&RightAngleBracket;&RightAngleBracket;</button>
        </div>
    </Transition>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";
.calendar-band {
    user-select: none;
    overflow: auto;
    position: relative;
    display: flex;
    gap: 1px;
    background-color: @coral-border-secondary;
    font-size: 14px;
    scroll-snap-type: x mandatory;
    width: 25%;
    &:has(>.calendar-month:nth-child(2)) {
        width: 50%;
    }
    &:has(>.calendar-month:nth-child(3)) {
        width: 75%;
    }
    &:has(>.calendar-month:nth-child(4)) {
        width: 100%;
    }
    .lefty-ctl, .righty-ctl {
        >button {
            border: 0;
            background-color: transparent;
            line-height: 2;
            width: 2em;
            text-align: center;
            cursor: pointer;
            .transit(color);
            .transit(background-color);
            &:hover {
                background-color: @coral-primary-bg;
            }
        }
    }
    .lefty-ctl {
        position: absolute;
        left: 0;
        top: 0;
    }
    .righty-ctl {
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>