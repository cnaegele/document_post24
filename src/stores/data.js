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
            idFamille: ref(''),
            famille: ref(''),
            idType: ref(''),
            type: ref(''),
            titre: ref(''),
            sujet: ref(''),
            description: ref(''),
            commentaire: ref(''),
            dateOfficielle: ref(''),
        },
        controle: {
            bDataFileOK: ref(true)
        },
        messagesErreur: {
            bSnackbar: ref(false),
            timeOutSnackbar: ref(10000),
            messageSnackbar: ref(''),
            dateDebut: ref(''),
            dateFin: ref(''),
            serverbackend: ref(''),
        }, 
    }),
    getters: {
        bdataOK: (state)  => {
            if (state.controle.bDataFileOK 
                //&& state.controle.bdataGenDateDebutOK
                //&& state.controle.bdataGenDateFinOK
            ) {
                return true
            } else {
                return false
            }
        }  
    }    
})