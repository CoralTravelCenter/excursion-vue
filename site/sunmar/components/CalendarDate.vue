<script setup>
import dayjs from "dayjs";
import { computed, inject } from "vue";

const props = defineProps(['date','disabled']);
const emit = defineEmits(['select-date', 'hover-date']);

const calendarMode = inject('calendar-mode');
const date = dayjs(props.date);

const isWeekend = computed(() => [0, 6].includes(date.day()));

const offersByDate = inject('offers-by-date');

const offers = computed(() => {
    return offersByDate.value[date.format('YYYY-MM-DD')];
});

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

function offerHref(offer) {
    const host = location.hostname === 'localhost' ? '//www.coral.ru' : '';
    const link = offer.link;
    return `${ host }/hotels${ link.redirectionUrl }/?qp=${ link.queryParam }&p=2`;
}

</script>

<template>
    <div class="calendar-date"
         :class="{
            disabled,
            weekend: isWeekend,
            selected: isSelected,
            available: !!offersByDate[date.format('YYYY-MM-DD')]
         }"
         @click="calendarMode === 'range' && emit('select-date', date)"
         @mouseenter="calendarMode === 'range' && emit('hover-date', date)">
        <span v-if="calendarMode === 'range' || !offers?.length" class="date" :style="{
            borderTopLeftRadius: isStartOfRange ? '100px' : 0,
            borderBottomLeftRadius: isStartOfRange ? '100px' : 0,
            borderTopRightRadius: isEndOfRange ? '100px' : 0,
            borderBottomRightRadius: isEndOfRange ? '100px' : 0
         }">{{ date.format('D') }}</span>
        <a v-else :href="offerHref(offers[0])" class="date" target="_blank">{{ date.format('D') }}</a>
        <span class="marker"></span>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/sunmar-colors-new";
@import "../common/css/layout";
.calendar-date {
    line-height: 1;
    display: grid;
    cursor: pointer;
    &.weekend {
        .date {
            color: @brand-error;
        }
    }
    &.available:not(.disabled) {
        .date {
            background-color: @brand-success-bg-hover;
            border: 1px solid white;
            border-left-width: 2px;
            border-right-width: 2px;
        }
        .marker {
            background-color: @brand-success-border;
        }
    }
    &:not(.available) {
        pointer-events: v-bind("calendarMode === 'nav' ? 'none' : 'auto' ");
    }
    &.selected, &:hover {
        .date {
            background-color: @brand-primary!important;
            color: white;
            border-color: @brand-primary!important;
        }
    }
    .date {
        height: 2em;
        display: inline-grid;
        place-content: center;
        background-color: white;
        color: inherit;
        .transit(color, .25s);
        .transit(background-color, .25s);
        .transit(border-color, .25s);
    }
    a.date {
        background-color: @brand-success-bg-hover;
        //box-shadow: inset 0 0 0 1px white;
        border: 1px solid white;
        border-left-width: 2px;
        border-right-width: 2px;
        text-decoration: none!important;
    }
    .marker {
        //visibility: v-bind("calendarMode === 'nav' ? 'hidden' : 'visible'");
        visibility: hidden;
        font-size: 62%;
        height: 2px;
    }
    &.disabled {
        visibility: hidden;
    }
}
</style>