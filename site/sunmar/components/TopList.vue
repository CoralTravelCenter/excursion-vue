<script setup>

import TopItem from "./TopItem.vue";

const props = defineProps({
    topList: Array
});

</script>

<template>
<div class="top-list">
    <TopItem v-for="ex in topList" :excursion="ex"/>
</div>
</template>

<style scoped lang="less">
@import "../common/css/layout";
.top-list {
    max-width: @max-content-width;
    display: flex;
    gap: 3em;
    justify-content: space-evenly;
    margin: 1.5em auto;
    @media screen and (max-width: 1530px) {
        font-size: .9vw;
    }
    @media screen and (max-width: @mobile-breakpoint) {
        flex-wrap: wrap;
        font-size: 1.5vw;
    }
    &:has(.top-item:nth-child(4)) {
        gap: 2em;
    }
}
</style>