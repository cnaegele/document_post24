import { defineStore } from 'pinia';
import { ref } from 'vue'
export const dataini = defineStore({
    id: 'iddataini',
    state: () => ({
        famillestypes: [],
        titre:  ref(''),
        sujet:  ref('sujet ini du store'),
        sizemax: ref(10000000),
    })
})