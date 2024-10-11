import { defineStore } from 'pinia';
import { ref } from 'vue'
export const storeuser = defineStore({
    id: 'iduser',
    state: () => ({
        idEmployeUser: ref(0),
        nomEmployeUser: ref(''),
        prenomEmployeUser: ref(''),
        loginEmployeUser: ref(''),
        groupeSecurite: ref(''),
        bInGroupe: ref(0),
    }),
})