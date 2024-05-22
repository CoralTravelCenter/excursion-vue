<script setup>

import { computed } from "vue";

const props = defineProps({
    excursionList: {
        type: Array,
        default: [],
    }
});

const excursionsMatchingCommonTimeframe = computed(() => {
    return props.excursionList;
});

</script>

<template>
<div class="excursion-vue">
    <div v-for="ex in excursionsMatchingCommonTimeframe">
        <div>{{ ex.parent.name }}</div>
        <div>{{ ex.name }}</div>
    </div>
</div>
</template>

<style scoped lang="less">
@import "../common/css/layout";
@import "../common/css/coral-colors";

.excursion-vue {
    padding: 2em;
    border: 1px solid #000;

    max-width: 100%;
    width: min(1370px, 90vw);

    margin-left: auto;
    margin-right: auto;

    .bbox();
    font-weight: normal;

    display: flex;
    flex-direction: column;
    gap: 1em;


}
</style>