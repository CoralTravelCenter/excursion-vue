
import { asap, hostReactAppReady } from '../../lib/usefuls';
import { createApp } from "vue";
import ExcursionVue from "../components/ExcursionVue.vue";

asap(async () => {
    await hostReactAppReady();
    const placeholders = document.querySelectorAll('[data-excursion-vue]');
    for (const place of placeholders) {
        try {
            const excursionList = JSON.parse(place.textContent);
            const app_root = place.parentElement;
            createVueApp(app_root, excursionList);
        } catch (ex) {
            console.warn(ex);
        }
    }

});

function createVueApp(app_root, excursionList) {
    createApp(ExcursionVue, { excursionList }).mount(app_root);
}