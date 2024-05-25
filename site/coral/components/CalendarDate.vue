<script setup>
import dayjs from "dayjs";
import { computed, inject } from "vue";

const props = defineProps(['date','disabled']);
const emit = defineEmits(['select-date', 'hover-date']);

const date = dayjs(props.date);

const isWeekend = computed(() => [0, 6].includes(date.day()));

const offersByDate = inject('offers-by-date');

const displayRangeSelected = inject('display-range-selected');
const isSelected = computed(() => {
    if (displayRangeSelected.value) {
        const [start, end] = displayRangeSelected.value;
        return date.isBetween(start, end, 'day', '[]');
    } else {
        return false;
    }
});
const isStartOfRange = computed(() => {
    if (displayRangeSelected.value) {
        const [start, end] = displayRangeSelected.value;
        return date.isSame(start, 'day');
    } else {
        return false;
    }
});
const isEndOfRange = computed(() => {
    if (displayRangeSelected.value) {
        const [start, end] = displayRangeSelected.value;
        return date.isSame(end, 'day');
    } else {
        return false;
    }
});

</script>

<template>
    <div class="calendar-date"
         :class="{
            disabled,
            weekend: isWeekend,
            selected: isSelected,
            available: !!offersByDate[date.format('YYYY-MM-DD')]
         }"
         @click="emit('select-date', date)"
         @mouseenter="emit('hover-date', date)">
        <span class="date" :style="{
            borderTopLeftRadius: isStartOfRange ? '100px' : 0,
            borderBottomLeftRadius: isStartOfRange ? '100px' : 0,
            borderTopRightRadius: isEndOfRange ? '100px' : 0,
            borderBottomRightRadius: isEndOfRange ? '100px' : 0
         }">{{ date.format('D') }}</span>
        <span class="marker"></span>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";
.calendar-date {
    line-height: 1;
    display: grid;
    cursor: pointer;
    &.weekend {
        .date {
            color: @coral-error;
        }
    }
    &.available {
        .marker {
            background-color: @coral-success-border;
        }
    }
    &.selected, &:hover {
        .date {
            background-color: @coral-primary;
            color: white;
        }
    }
    .date {
        height: 2em;
        display: inline-grid;
        place-content: center;
        background-color: white;
        .transit(color, .25s);
        .transit(background-color, .25s);
    }
    .marker {
        font-size: 62%;
        height: 2px;
    }
    &.disabled {
        visibility: hidden;
    }
}
</style>