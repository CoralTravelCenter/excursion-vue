<script setup>

import { inject } from "vue";

const props = defineProps({
    excursion: Object
});

const chooseExcursionByLocationId = inject('choose-excursion-by-location-id');

</script>
<template>
    <div class="top-item">
        <div class="visual"><div :style="{ backgroundImage: `url(${ excursion.bestOffer.visual })` }"></div></div>
        <div class="info">
            <div class="name">{{ excursion.name }}</div>
            <div class="accommodation">
                {{ excursion.days }} {{ excursion.days.asDays() }}  /  {{ excursion.nights }} {{ excursion.nights.asNights() }}
            </div>
            <div class="price-value">{{ (excursion.bestOffer.price.formatCurrency()) }}</div>
            <button class="action" @click="chooseExcursionByLocationId(excursion.locationId)">Выбрать тур <span class="mark">&darr;</span></button>
        </div>
    </div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";
.top-item {
    flex: 0 1 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 0 0 1px @coral-border-secondary;
    border-radius: (16/14em);
    background: white;
    @media screen and (max-width: @mobile-breakpoint) {
        flex: 0 1 45%;
    }
    .visual {
        .proportional(16/9);
        width: 100%;
        >div {
            inset: .5em;
            background: center / cover no-repeat;
            border-radius: .75em;
        }
    }
    .info {
        padding: 0 1em 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .name {
        display: grid;
        place-content: center;
        height: 3.3em;
        margin: .7em auto .4em;
        font-size: 1.2em;
        line-height: 1.1;
        font-weight: 600;
        overflow: hidden;
    }
    .accommodation {
        font-weight: 300;
        display: flex;
        align-items: center;
        line-height: 1;
        &:before {
            content: '';
            width: 2em;
            height: (18/22) * 2em;
            margin-right: .5em;
            background: url(data-url:/site/coral/assets-inline/icon-couple.svg) center / cover no-repeat;
        }
    }
    .price-value {
        color: @coral-primary;
        font-weight: 600;
        font-size: (24/14em);
        line-height: 1;
        margin: .5em auto;
    }

    .action {
        .interactive();
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: (16/14em);
        height: 2.6em;
        padding: 0 1.5em;
        border: 0;
        border-radius: .6em;
        background: @coral-primary;
        color: white;
        text-decoration: none!important;
        cursor: pointer;
        .mark {
            margin-left: 1em;
        }
    }

}
</style>