<script setup>

import { computed, provide, ref } from "vue";
import ExcursionCard from "./ExcursionCard.vue";
import dayjs from "dayjs";
import locale_ru from 'dayjs/locale/ru';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import CalendarBand from "./CalendarBand.vue";
import { groupBy } from "lodash";

dayjs.locale(locale_ru);
dayjs.extend(isSameOrAfter);

const props = defineProps({
    excursionList: {
        type: Array,
        default: [],
    }
});

const actualExcursions = computed(() => {
    const tomorrow = dayjs().add(1, 'day');
    return props.excursionList.filter(excursion => {
        excursion.offers = excursion.offers.filter(offer => {
            const offer_date = dayjs(offer.date);
            return offer_date.isSameOrAfter(tomorrow, 'day');
        });
        return !!excursion.offers.length;
    });
});

const selectedTimeframe = ref(null);

const excursionsMatchingCommonTimeframe = computed(() => {
    if (selectedTimeframe.value) {
        return [...(function* () {
            const [start, end] = selectedTimeframe.value;
            for (const excursion of actualExcursions.value) {
                const ex = JSON.parse(JSON.stringify(excursion));
                ex.offers = ex.offers.filter(e => dayjs(e.date).isBetween(start, end, 'day', '[]'));
                if (!!ex.offers.length) yield ex;
            }
        })()];
    } else {
        return actualExcursions.value;
    }
});

const allOffers = computed(() => {
    return actualExcursions.value.map(ex => ex.offers).flat();
});

const offersByDate = computed(() => groupBy(allOffers.value, offer => offer.date));
provide('offers-by-date', offersByDate);

const wholeTimeframe = computed(() => {
    const sorted_dates = allOffers.value.map(offer => offer.date).sort();
    return { since: dayjs(sorted_dates.at(0)), until: dayjs(sorted_dates.at(-1)) }
});


</script>

<template>
<div class="excursion-vue">
    <CalendarBand mode="range" v-model:selection="selectedTimeframe" :timeframe="wholeTimeframe"/>
    <div class="excursion-list">
        <TransitionGroup name="push-inout">
            <ExcursionCard v-for="ex in excursionsMatchingCommonTimeframe"
                           :prefer-date-range="selectedTimeframe"
                           :key="ex.locationId"
                           :excursion="ex" />
        </TransitionGroup>
    </div>
</div>
</template>

<style scoped lang="less">
@import "../common/css/layout";
@import "../common/css/coral-colors";

.excursion-vue {
    max-width: 100%;
    width: min(1370px, 90vw);

    margin-left: auto;
    margin-right: auto;

    .bbox();
    font-weight: normal;

    display: flex;
    flex-direction: column;
    gap: 1em;

    .excursion-list {

    }

}
</style>