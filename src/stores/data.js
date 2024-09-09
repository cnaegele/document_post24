import { defineStore } from 'pinia';
import { ref } from 'vue'
export const data = defineStore({
    id: 'iddata',
    state: () => ({
        env: {
            version: ref('0.0.0'),
            dateversion: ref('03.09.2024'),
            themeChoisi: ref(localStorage.getItem('themeChoisi') || 'dark'),
        },
        user: {
            idEmployeUser: ref(0),
            nomEmployeUser: ref(''),
            prenomEmployeUser: ref(''),
            loginEmployeUser: ref(''),
            groupeSecurite: ref(''),
            bInGroupe: ref(0),
        },
        file: ref(null),
        document: {
            idFamille: ref(0),
            famille: ref(''),
            idType: ref(0),
            type: ref(''),
            titre: ref(''),
            sujet: ref(''),
            description: ref(''),
            commentaire: ref(''),
            dateOfficielle: ref(''),
        },
        messagesErreur: {
            bSnackbar: ref(false),
            timeOutSnackbar: ref(10000),
            messageSnackbar: ref(''),
            dateDebut: ref(''),
            dateFin: ref(''),
            serverbackend: ref(''),
        }, 
    })
})