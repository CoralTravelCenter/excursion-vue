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
    display: flex;
    gap: 3em;
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
    justify-content: space-evenly;
    margin: 1.5em 0;
}
</style>