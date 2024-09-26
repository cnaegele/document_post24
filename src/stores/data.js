import { defineStore } from 'pinia';
import { ref } from 'vue'
export const data = defineStore({
    id: 'iddata',
    state: () => ({
        env: {
            version: ref('0.1.0'),
            dateversion: ref('19.09.2024'),
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
            documentIntExt: ref('docInterne'),
            idEmployeAuteur: ref(0),
            acteurAuteur: ref([]),
            /*
                id: ref(0),
                nom: ref('')
            */
            idNiveauConfidentialite: ref('1')
       },
        controle: {
            bDataFileOK: ref(true),
            bDataTitreOK: ref(true),
            bDataFamilleOK: ref(true),
            bDataTypeOK: ref(true),
            bDataDateOfficielleOK: ref(false), //champ html date, pas de rules
            bDataAuteurOK: ref(false), //règles combinée, interne (employé), externe (acteur), inconnu
        },
        messagesErreur: {
            bSnackbar: ref(false),
            timeOutSnackbar: ref(10000),
            messageSnackbar: ref(''),
            serverbackend: ref(''),
        }, 
    }),
    getters: {
        bdataOK: (state)  => {
            if (state.controle.bDataFileOK 
                && state.controle.bDataTitreOK
                && state.controle.bDataFamilleOK
                && state.controle.bDataTypeOK
                && state.controle.bDataDateOfficielleOK
                && state.controle.bDataAuteurOK
            ) {
                return true
            } else {
                return false
            }
        }  
    }    
})