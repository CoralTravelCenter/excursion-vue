<script setup>
import dayjs from "dayjs";
import { computed, inject } from "vue";

const props = defineProps(['date','disabled']);
const emit = defineEmits(['select-date', 'hover-date']);

const date = dayjs(props.date);

const isWeekend = computed(() => [0, 6].includes(date.day()));

const offersByDate = inject('offers-by-date');

</script>

<template>
    <div class="calendar-date"
         :class="{ disabled, weekend: isWeekend, available: !!offersByDate[date.format('YYYY-MM-DD')] }"
         @click="emit('select-date', date)"
         @mouseenter="emit('hover-date', date)">
        <span class="date">{{ date.format('D') }}</span>
        <span class="marker"></span>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
.calendar-date {
    line-height: 1;
    display: grid;
    cursor: default;
    &:hover {
        .date {
            filter: invert(1);
        }
    }
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
    .date {
        height: 2em;
        display: inline-grid;
        place-content: center;
        background-color: white;
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