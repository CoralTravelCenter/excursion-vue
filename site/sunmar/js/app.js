
import { asap, hostReactAppReady } from '../../lib/usefuls';
import { createApp } from "vue";
import ExcursionVue from "../components/ExcursionVue.vue";

asap(async () => {
    await hostReactAppReady();
    const placeholders = document.querySelectorAll('[data-excursion-vue]');
    for (const place of placeholders) {
        try {
            let parsed_setup = JSON.parse(place.textContent);
            let excursionList, options;
            if (Array.isArray(parsed_setup)) {
                excursionList = parsed_setup;
                options = {};
            } else {
                excursionList = parsed_setup.excursions;
                options = parsed_setup.options;
            }
            const app_root = place.parentElement;
            createVueApp(app_root, excursionList, options);
        } catch (ex) {
            console.warn(ex);
        }
    }

});

function createVueApp(app_root, excursionList, options) {
    createApp(ExcursionVue, { excursionList, options }).mount(app_root);
}