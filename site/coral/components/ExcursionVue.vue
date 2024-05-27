<script setup>

import { computed, provide, ref } from "vue";
import ExcursionCard from "./ExcursionCard.vue";
import dayjs from "dayjs";
import locale_ru from 'dayjs/locale/ru';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import CalendarBand from "./CalendarBand.vue";
import { groupBy } from "lodash";
import { genitive, prepositional } from "../../lib/month-case";

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

const timeframeWording = computed(() => {
    if (selectedTimeframe.value) {
        const [start, end] = selectedTimeframe.value;
        const isSameDate = start.isSame(end, 'day');
        const isSameMonth = start.isSame(end, 'month');
        const isStartOfMonth = start.isSame(start.startOf('month'), 'day');
        const isEndOfMonth = end.isSame(end.endOf('month'), 'day');
        if (isSameDate) {
            return `${ start.date() } ${ genitive[start.month()] }`;
        } else {
            if (isStartOfMonth && isEndOfMonth) {
                // whole month(s) selected
                return isSameMonth ? `в ${ prepositional[start.month()] }`
                                   : `в ${ prepositional[start.month()] } — ${ prepositional[end.month()] }`;
            } else {
                if (isSameMonth) {
                    return `${ start.date() } — ${ end.date() } ${ genitive[end.month()] }`;
                } else {
                    return `${ start.date() } ${ genitive[start.month()] } — ${ end.date() } ${ genitive[end.month()] }`;
                }
            }
        }
    } else {
        return `в ${ prepositional[wholeTimeframe.value.since.month()] } — ${ prepositional[wholeTimeframe.value.until.month()] }`
    }
});

</script>

<template>
<div class="excursion-vue">
    <h2>Календарь экскурсионных туров</h2>
    <CalendarBand mode="range" v-model:selection="selectedTimeframe" :timeframe="wholeTimeframe"/>
    <h2>
        Экскурсионные туры {{ timeframeWording }}
        <button v-if="selectedTimeframe" class="clear-selected-timeframe"
                @click="selectedTimeframe = null">
            <span style="font-size: 1.62em; margin-right: .3em;">&times;</span>
            Сбросить фильтр по датам
        </button>
    </h2>
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
@import "../common/css/coral-colors-new";

.excursion-vue {
    max-width: 100%;
    width: min(1370px, 90vw);

    margin-left: auto;
    margin-right: auto;
    padding: 1.5em 0;

    .bbox();
    font-weight: normal;

    display: flex;
    flex-direction: column;
    gap: 1.5em;

    > h2 {
        display: flex;
        gap: .5em;
        justify-content: center;
        align-items: center;
        margin: auto;
        @media screen and (max-width: @mobile-breakpoint) {
            flex-direction: column;
        }
    }

    .clear-selected-timeframe {
        .interactive();
        border: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        background-color: @coral-primary;
        color: white;
        height: 2.3em;
        padding: 0 1em;
        border-radius: .5em;
        cursor: pointer;
    }

}
</style>