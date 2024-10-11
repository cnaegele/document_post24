import { defineStore } from 'pinia';
import { ref } from 'vue'
export const storevtfytheme = defineStore({
    id: 'idstorevtfytheme',
    state: () => ({
        themeChoisi: ref(localStorage.getItem('themeChoisi') || 'dark'),
    }),
})