<script setup>

import ppp from '../../lib/prototypes';
import { computed, provide, ref } from "vue";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import { groupBy } from "lodash";
import CalendarBand from "./CalendarBand.vue";

dayjs.extend(isBetween);

const props = defineProps({
    excursion: Object,
    preferDateRange: {
        type: Array,
        default: []
    }
});

const offersInPreferredDateRange = computed(() => {
    if (props.preferDateRange?.length === 2) {
        const [startDate, endDate] = props.preferDateRange.map(d => dayjs(d));
        return props.excursion.offers.filter(offer => dayjs(offer.date).isBetween(startDate, endDate, 'day', '[]'));
    } else {
        return props.excursion.offers;
    }
});

const hasSingleOfferInPreferredDateRange = computed(() => offersInPreferredDateRange.value.length === 1);

function offerHref(offer) {
    const host = location.hostname === 'localhost' ? '//www.coral.ru' : '';
    const link = offer.link;
    return `${ host }/hotels${ link.redirectionUrl }/?qp=${ link.queryParam }&p=2`;
}

const isOpen = ref(false);

const showCalendar = computed(() => {
    return isOpen.value && !hasSingleOfferInPreferredDateRange.value;
});

const offersByDate = computed(() => groupBy(props.excursion.offers, offer => offer.date));
provide('offers-by-date', offersByDate);

const excursionTimeframe = computed(() => {
    const sorted_dates = props.excursion.offers.map(offer => offer.date).sort();
    return { since: dayjs(sorted_dates.at(0)), until: dayjs(sorted_dates.at(-1)) }
});

</script>

<template>
<div class="excursion-card">
    <div class="visual-info-pricing">
        <div class="visual">
            <div :style="{ backgroundImage: `url(${ excursion.bestOffer.visual })` }"></div>
        </div>
        <div class="info">
            <div class="location">{{ excursion.parent.name }}</div>
            <h2 class="name">{{ excursion.name }}</h2>
            <div class="room">{{ excursion.bestOffer.room }}</div>
            <div class="meal">{{ excursion.bestOffer.meal }}</div>
        </div>
        <div class="pricing">
            <div class="price-info">
                <div class="label">цена от:</div>
                <div class="price-value">{{ (excursion.bestOffer.price.formatCurrency()) }}</div>
            </div>
            <div class="accommodation">
                <span v-if="hasSingleOfferInPreferredDateRange">{{ dayjs(offersInPreferredDateRange[0].date).format('DD.MM.YYYY') }} &mdash; </span>
                {{ excursion.nights }} {{ excursion.nights.asNights() }}
            </div>
            <div v-if="!!excursion.bestOffer.installment" class="installment">
                <div class="description">
                    Доступно в рассрочку и кредит
                    <span style="white-space: nowrap">от {{ excursion.bestOffer.installment.formatCurrency() }} в мес.</span>
                </div>
            </div>

            <a v-if="hasSingleOfferInPreferredDateRange" :href="offerHref(offersInPreferredDateRange[0])" target="_blank" class="action">Выбрать тур</a>
            <button v-else class="action" @click="isOpen = !isOpen">
                <span>Выбрать дату</span>
                <span class="disclose-mark" :style="{ transform: `rotate(${ isOpen ? 90 : -90 }deg)` }">&Lang;</span>
            </button>

        </div>
    </div>
    <div class="calendar" v-if="showCalendar">
        <CalendarBand mode="nav" :timeframe="excursionTimeframe" />
    </div>
</div>
</template>

<style scoped lang="less">
@import "../common/css/coral-colors-new";
@import "../common/css/layout";
.excursion-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 0 1px @coral-border-secondary;
    border-radius: (16/14em);
    background: white;
    font-size: inherit;
    .push-inout-transition(@max-height: 33em);
    @media screen and (max-width: @strange-breakpoint) {
        font-size: 1.2vw;
    }
    @media screen and (max-width: @narrow-breakpoint) {
        max-height: unset!important;
        font-size: 3vw;
    }
    &:nth-child(n+2) {
        margin-top: (24/14em);
    }
    .visual-info-pricing {
        display: flex;
        @media screen and (max-width: @narrow-breakpoint) {
            flex-direction: column;
        }
    }
    .calendar {
        display: flex;
        justify-content: flex-end;
        background-color: white;
    }
    .visual {
        .proportional(16/10);
        flex: 0 0 (.38 * .62 * 100%);
        @media screen and (max-width: @narrow-breakpoint) {
            .proportional(16/9);
            flex: 1;
        }
        >div {
            inset: .5em;
            background: center / cover no-repeat;
            border-radius: .75em;
        }
    }
    .info {
        flex: 1;
        padding: 1em;
        >* {
            &:nth-child(n+2) {
                margin-top: (8/14em);
            }
        }
        .location, .meal, .room {
            font-size: (12/14em);
            font-weight: 300;
        }
        .location {
            display: flex;
            align-items: center;
            &:before {
                content: '';
                height: 1.2em;
                width: (10/16) * 1.2em;
                background: url(data-url:/site/coral/assets-inline/location-placemark.svg) center / cover no-repeat;
                margin-right: .5em;
            }
        }
        .room {
            display: flex;
            align-items: center;
            &:before {
                content: '';
                height: 1.0em;
                width: (40/33) * 1.0em;
                margin-right: .5em;
                background: url(data-url:/site/coral/assets-inline/icon-bed.svg) center / cover no-repeat;
            }
        }
        .meal {
            display: flex;
            align-items: center;
            &:before {
                content: '';
                height: 1.0em;
                width: (43/33) * 1.0em;
                margin-right: .5em;
                background: url(data-url:/site/coral/assets-inline/icon-meal.svg) center / cover no-repeat;
            }
        }
        h2 {
            font-size: (20/14em);
            margin: unset;
        }
    }
    .pricing {
        flex: 0 0 25%;
        display: flex;
        flex-direction: column;
        //justify-content: space-between;
        border-left: 1px solid @coral-border-secondary;
        padding: .5em;
        .price-info {
            .label {
                font-size: (11/14em);
                font-weight: 300;
            }
            .price-value {
                color: @coral-primary;
                font-weight: 600;
                font-size: (24/14em);
            }
        }
        .accommodation {
            margin-top: (8/14em);
            font-weight: 300;
            display: flex;
            align-items: center;
            &:before {
                content: '';
                width: 2em;
                height: (18/22) * 2em;
                margin-right: .5em;
                background: url(data-url:/site/coral/assets-inline/icon-couple.svg) center / cover no-repeat;
            }
        }
        .installment {
            //margin-top: (8/14em);
            margin: auto 0;
            padding: 0 1em;
            height: 3.3em;
            display: flex;
            align-items: center;
            font-size: (11/14em);
            font-weight: 300;
            line-height: 1.1;
            border: 1px solid @coral-border-secondary;
            border-radius: 1em;
            @media screen and (max-width: @narrow-breakpoint) {
                margin: 1em 0;
            }
            &:before {
                content: '';
                width: 1.2em;
                height: 1.2em;
                margin-right: .5em;
                background: url(data-url:/site/coral/assets-inline/icon-percent.svg) center / cover no-repeat;
            }
        }
        .action {
            .interactive();
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: (16/14em);
            height: 3em;
            border: 0;
            border-radius: .6em;
            background: @coral-primary;
            color: white;
            text-decoration: none!important;
            cursor: pointer;
            .disclose-mark {
                //transform: rotate(-90deg);
                margin-left: 1em;
                font-size: 1.2em;
                .transit(transform, .25s);
            }
        }
    }
}
</style>