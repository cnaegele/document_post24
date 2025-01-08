import { defineStore } from 'pinia';
import { ref } from 'vue'
export const storedatadoc = defineStore({
    id: 'iddata',
    state: () => ({
        env: {
            version: ref('1.0.4'),
            dateversion: ref('07.01.2025'),
        },
        file: ref(null),
        filemd5: ref(''),
        filesha256: ref(''),
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
            objetsLies: ref([]),
            /*
                id: ref(0),
                type: ref(''),
                nom: ref('')
            */
            idNiveauConfidentialite: ref('1'),
            employesDroitConsultation: ref([]),
            /*
                id: ref(0),
                nom: ref(''),
                prenom: ref(''),
                unite: ref('')
            */
            unitesOrgDroitConsultation: ref([]),
            /*
                id: ref(0),
                nom: ref(''),
            */
            groupesSecuriteDroitConsultation: ref([]),
            /*
                id: ref(0),
                nom: ref(''),
                description: ref('')
            */        
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