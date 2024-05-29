<script setup>
import { computed, provide, reactive, ref } from "vue";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import CalendarMonth from "./CalendarMonth.vue";
import { dateSequence } from "../../lib/date-util";
import { onClickOutside, useScroll } from "@vueuse/core";

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
const { arrivedState, x: scrolledX } = useScroll($el, { behavior: 'smooth' });

function scrollLeft() {
    scrolledX.value -= $el.value.querySelector('.calendar-month').getBoundingClientRect().width;
}
function scrollRight() {
    scrolledX.value += $el.value.querySelector('.calendar-month').getBoundingClientRect().width;
}
function scrollPageLeft() {
    scrolledX.value -= $el.value.getBoundingClientRect().width;
}
function scrollPageRight() {
    scrolledX.value += $el.value.getBoundingClientRect().width;
}

onClickOutside($el, () => {
    if (clickedDates.length === 1) {
        clickedDates.splice(0);
    }
});

</script>

<template>
<div ref="$el" class="calendar-band">
    <CalendarMonth v-for="month in monthsSequence" :month="month"
                   :key="month.valueOf()"
                   @selectDate="handleSelectDate"
                   @hoverDate="handleHoverDate"
                   @selectRange="handleSelectRange"
                   @hoverRange="handleHoverRange"/>
    <Transition name="fade">
        <div v-if="!arrivedState.left" :style="{ transform: `translateX(${ scrolledX }px)` }" class="lefty-ctl">
            <button @click="scrollPageLeft">&LeftAngleBracket;&LeftAngleBracket;</button>
            <button @click="scrollLeft">&LeftAngleBracket;</button>
        </div>
    </Transition>
    <Transition name="fade">
        <div v-if="!arrivedState.right" :style="{ transform: `translateX(${ scrolledX }px)` }" class="righty-ctl">
            <button @click="scrollRight">&RightAngleBracket;</button>
            <button @click="scrollPageRight">&RightAngleBracket;&RightAngleBracket;</button>
        </div>
    </Transition>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";

.fade-inout() {
    .transit(opacity, .3s);
    &.fade-enter-from, &.fade-leave-to {
        opacity: 0;
    }

}

.calendar-band {
    box-shadow: v-bind("mode === 'range' ? '0 0 0 1px rgba(0,0,0,.06)' : 'none' ");
    user-select: none;
    overflow: auto;
    position: relative;
    display: flex;
    gap: 1px;
    background-color: @coral-border-secondary;
    font-size: inherit;
    scroll-snap-type: x mandatory;
    width: 25%;
    @media screen and (max-width: @strange-breakpoint) {
        width: (100%/3);
    }
    @media screen and (max-width: @mobile-breakpoint) {
        width: (100%/2);
    }
    @media screen and (max-width: @narrow-breakpoint) {
        width: 100%!important;
    }
    &:has(>.calendar-month:nth-child(2)) {
        width: 50%;
    }
    &:has(>.calendar-month:nth-child(3)) {
        width: 75%;
    }
    &:has(>.calendar-month:nth-child(4)) {
        width: 100%;
    }
    @media screen and (max-width: @strange-breakpoint) {
        &:has(>.calendar-month:nth-child(2)) {
            width: (2 * 100%/3);
        }
        &:has(>.calendar-month:nth-child(3)) {
            width: 100%;
        }
    }
    @media screen and (max-width: @mobile-breakpoint) {
        font-size: 1.4vw;
        &:has(>.calendar-month:nth-child(2)) {
            width: 100%;
        }
    }
    @media screen and (max-width: @narrow-breakpoint) {
        font-size: 3vw;
    }
    .lefty-ctl, .righty-ctl {
        .fade-inout();
        padding: 0 .5em;
        >button {
            border: 0;
            background-color: transparent;
            font-size: inherit;
            line-height: 2;
            width: 2em;
            padding: 0;
            text-align: center;
            cursor: pointer;
            .transit(color);
            .transit(background-color);
            &:hover {
                background-color: @coral-primary;
                color: white;
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