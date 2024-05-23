<script setup>

import { computed } from "vue";
import ExcursionCard from "./ExcursionCard.vue";
import dayjs from "dayjs";

const props = defineProps({
    excursionList: {
        type: Array,
        default: [],
    }
});

const excursionsMatchingCommonTimeframe = computed(() => {
    return props.excursionList;
});

const allOffers = computed(() => {
    return props.excursionList.map(ex => ex.offers).flat();
});

const wholeTimeframe = computed(() => {
    const sorted_dates = allOffers.value.map(offer => offer.date).sort();
    return { since: dayjs(sorted_dates.at(0)), until: dayjs(sorted_dates.at(-1)) }
});

</script>

<template>
<div class="excursion-vue">
    <div class="excursion-list">
        <TransitionGroup name="push-inout">
            <ExcursionCard v-for="ex in excursionsMatchingCommonTimeframe"
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