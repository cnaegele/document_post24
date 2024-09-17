<style scoped>
.go-erreur {
    font-size: small;
    color: rgb(177, 14, 14);
    vertical-align: bottom;
}
</style>

<template>
  <v-snackbar
    color="#FFCDD2"
    multi-line
    location="center"
    v-model="lesDatas.messagesErreur.bSnackbar"
    :timeout="lesDatas.messagesErreur.timeOutSnackbar"
  >
    <div v-html="lesDatas.messagesErreur.messageSnackbar"></div>
    <template v-slot:actions>
      <v-btn
        text="Fermer"
        variant="tonal"
        @click="lesDatas.messagesErreur.bSnackbar = false"
      ></v-btn>
    </template>
  </v-snackbar>

  <AppToper />
  <v-container>
    <v-row dense>
      <v-col>
        <v-file-input
          v-model="lesDatas.file"
          show-size
          label="Sélectionnez un fichier"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Titre</v-col>
        <v-col cols="12" md="10">
            <v-text-field
                v-model="lesDatas.document.titre"
                :rules="titreRules"
                required
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="2" class="titreChampSaisie">Famille</v-col>
        <v-col cols="12" md="3">
            <v-select
                v-model="lesDatas.document.idFamille"
                :items="itemsFamille"
                item-title="label"
                :reduce="(item) => itemsFamille.value"
                :rules="familleRules"
                placeholder="Sélectionner la famille du document"
            ></v-select>                     
        </v-col>
        <v-col cols="12" md="1"></v-col>
        <v-col cols="12" md="1" class="titreChampSaisie">Type</v-col>
        <v-col cols="12" md="2">
            <v-select
                v-model="lesDatas.document.idType"
                :items="itemsType"
                item-title="label"
                :reduce="(item) => itemsType.value"
                :rules="typeRules"
                placeholder="Sélectionner le type du document"
            ></v-select>                     
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Sujet</v-col>
        <v-col cols="12" md="10">
            <v-text-field
                v-model="lesDatas.document.sujet"
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Description</v-col>
        <v-col cols="12" md="10">
            <v-textarea
                v-model="lesDatas.document.description"
                rows="1"
                auto-grow
            ></v-textarea>                        
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Commentaire</v-col>
        <v-col cols="12" md="10">
            <v-textarea
                v-model="lesDatas.document.commentaire"
                rows="1"
                auto-grow
            ></v-textarea>                        
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Date officielle</v-col>
        <v-col cols="12" md="3">
            <div class="go_divdate">
                <input
                    type="date"
                    id="inpDateOfficielle"
                    class="go_input"
                    v-model="lesDatas.document.dateOfficielle"
                    @keyup="inpDateOfficiellekeyup"
                ></input>
                <span class="go-erreur">&nbsp;&nbsp;&nbsp;&nbsp;{{ messagesErreurDateOfficielle }}</span>
            </div>
        </v-col>
        <v-col cols="12" md="2">
            <v-checkbox 
                label="inconnue"
                v-model="bDateOfficielleInconnue"
            ></v-checkbox>
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">
            <span>Auteur&nbsp;&nbsp;</span>
            <span v-if="lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu">
                <v-btn size="x-small" rounded="xl" class="text-none" @click="bChoixEmploye=!bChoixEmploye">Choix employé</v-btn>
                <br>    
                <v-btn size="x-small" rounded="xl" class="text-none" @click="auteurUser">moi</v-btn>
            </span>
            <span v-if="lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu">
                <v-btn size="x-small" rounded="xl" class="text-none" @click="bChoixActeur=!bChoixActeur">Choix acteur(s)</v-btn>
            </span>
       </v-col>
        <v-col cols="12" md="10">
            <div>
                <v-radio-group inline hide-details="true" v-model="lesDatas.document.documentIntExt">
                    <v-radio label="document interne" value="docInterne"></v-radio>
                    <v-radio label="document externe" value="docExterne"></v-radio>
                </v-radio-group>
            </div>
            <div v-if="lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ txtEmployeAuteur }}
            </div>
            <div v-if="!lesDatas.controle.bDataAuteurOK" class="go-erreur">l'auteur est obligatoire ou signalé inconnu</div>
            <div v-if="lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu">
                <v-container v-if="lesDatas.document.acteurAuteur.length > 0">
                    <v-row v-for="(acteurAuteur, index) in lesDatas.document.acteurAuteur" :key="acteurAuteur.idActeur" dense class="d-flex align-center">
                        <v-col cols="12" md="1">
                            <v-tooltip text="supprimer cet auteur">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                v-bind="props"
                                icon="mdi-delete"
                                variant="text"
                                @click="supprimeActeurAuteur(acteurAuteur.id)"
                                ></v-btn>
                            </template>        
                            </v-tooltip>
                        </v-col>  
                        <v-col cols="12" md="11">{{ acteurAuteur.nom }}</v-col>
                    </v-row>    
                </v-container>
            </div>
            <div v-if="bChoixEmploye">
                <Suspense>
                    <EmployeChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="'unique'"
                        @choixEmploye="receptionEmployeAuteur"
                    />
                </Suspense>
            </div>
            <div v-if="bChoixActeur">
                <ActeurChoix 
                    critereTypeInit="nom"
                    nombreMaximumRetour="50"
                    :modeChoix="'unique'"
                    @choixActeur="receptionActeurAuteur"
                    >
                    </ActeurChoix>
            </div>
            <div>
                <v-checkbox 
                    label="inconnu"
                    v-model="bAuteurInconnu"
                ></v-checkbox>
            </div>
        </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="2" class="titreChampSaisie">Niveau de confidentialité</v-col>
        <v-col cols="12" md="5">
            <v-select
                v-model="lesDatas.document.idNiveauConfidentialite"
                :items="itemsNivConf"
                item-title="label"
                :reduce="(item) => itemsNivConf.value"
                placeholder="Sélectionner le niveau de confidentialité"
            ></v-select>                     
        </v-col>
    </v-row>
  </v-container>
  <AppFooter/>
  </template>
  
 <script setup>
import { ref, toRefs, watch } from 'vue'
import { data } from '@/stores/data.js'
import { documentPostProps } from './DocumentPostProps.js'
import { getDicoNiveauConfidentialite } from '../axioscalls.js'
import { verifieNouveauMD5 } from '@/sauve.js'
import EmployeChoix from '../../../employechoix/src/components/EmployeChoix.vue'
import ActeurChoix from '../../../acteurchoix/src/components/ActeurChoix.vue'

const lesDatas = data()
const props = defineProps(documentPostProps)
const { famillestypes } = toRefs(props)
const { sizemax } = toRefs(props)
lesDatas.document.sizemax = sizemax
const { titre } = toRefs(props)
lesDatas.document.titre = titre.value
const { sujet } = toRefs(props)
lesDatas.document.sujet = sujet.value

const itemsFamille = ref([])
const itemsType = ref([])
let itemF
for (let i=0; i<famillestypes.value.length; i++) {
    itemF = {
        id: famillestypes.value[i].id,
        label: famillestypes.value[i].label,
        value: famillestypes.value[i].value,
    }
    itemsFamille.value.push(itemF)
}
const itemsNivConf = await getDicoNiveauConfidentialite()
//console.log(itemsNivConf)

const bDateOfficielleInconnue = ref(false)
const bAuteurInconnu = ref(false)
const bChoixEmploye = ref(false)
const txtEmployeAuteur = ref('')
const bChoixActeur = ref(false)

const messagesErreurDateOfficielle = ref('')

const titreRules = [
    value => {
        lesDatas.controle.bDataTitreOK = false
        if (value.trim().length >= 5) {
            lesDatas.controle.bDataTitreOK = true
            return true
        }
        return 'Le titre est obligatoire et doit contenir au moins 5 caractères'
    }
]
const familleRules = [
    value => {
        lesDatas.controle.bDataFamilleOK = false
        if (value !== '') {
            lesDatas.controle.bDataFamilleOK = true
            return true
        }
        return 'choisir une famille' 
    }
]
const typeRules = [
    value => {
        lesDatas.controle.bDataTypeOK = false
        if (value !== '') {
            lesDatas.controle.bDataTypeOK = true
            return true
        }
        return 'choisir un type' 
    }
]

const inpDateOfficiellekeyup = () => {
    //Avec les input de type date standard du html, 
    //On peut saisir au clavier des dates invalides (31 février par exemple).
    //Mais alors la value du input est vide donc la variable v-model aussi 
    //Du coup, il faut vérifier le validity.badInput le l'objet input de type date si on veut indiquer date invalide
    //qui de toute façon ve na pas être passée plus loin mais dans ce cas, la vue à l'écran ne correspond pas à la valeur 
    //effective de la date qui est vide.
    const inpDate = document.getElementById('inpDateOfficielle')
    if (inpDate.validity.badInput) {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est invalide'
    } else {
        messagesErreurDateOfficielle.value = ''
    }
}
watch(() => lesDatas.document.dateOfficielle, () => {
    //Comme on utilise pas un composant vuetify
    //if faut faire l'equivalent des rules ici
    messagesErreurDateOfficielle.value = ''
    lesDatas.controle.bDataDateOfficielleOK = true
    if (lesDatas.document.dateOfficielle === '' && !bDateOfficielleInconnue.value) {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est obligatoire ou signalée inconnue'   
    }
})

watch(() => lesDatas.document.idFamille, (newValueF, oldValueF) => {
    itemsType.value = []
    let itemT
    for (let i=0; i<famillestypes.value.length; i++) {
        if (famillestypes.value[i].value == newValueF) {
            for (let j=0; j<famillestypes.value[i].type.length; j++) {
                itemT = {
                    id: famillestypes.value[i].type[j].id,
                    label: famillestypes.value[i].type[j].label,
                    value: famillestypes.value[i].type[j].value,
                }
                itemsType.value.push(itemT)
            }
        break;    
        }
    }
    
    if (lesDatas.file !== null) {
        let bTrouve = false
        let fileExtension = ''
        const posi = lesDatas.file.name.lastIndexOf('.')
        if (posi !== -1) {
            fileExtension = lesDatas.file.name.substr(posi+1)
            for (let i=0; i<itemsType.value.length; i++) {
                if (itemsType.value[i].label == fileExtension) {
                    lesDatas.document.idType = itemsType.value[i].value
                    bTrouve = true
                    break   
                }
            }
        }
        if (!bTrouve) {
            lesDatas.document.idType = ''
            lesDatas.messagesErreur.timeOutSnackbar = 10000
            lesDatas.messagesErreur.bSnackbar = true
            lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) n'est pas prévue pour cette famille de document`
       }    
    }
})

watch(() => lesDatas.document.idType, (newValueT, oldValueT) => {
    if (lesDatas.file !== null) {
        let fileExtension = ''
        const posi = lesDatas.file.name.lastIndexOf('.')
        if (posi !== -1) {
            fileExtension = lesDatas.file.name.substr(posi+1)
            for (let i=0; i<itemsType.value.length; i++) {
                if (itemsType.value[i].value == newValueT) {
                    if (itemsType.value[i].label !== fileExtension) {
                        lesDatas.messagesErreur.timeOutSnackbar = 10000
                        lesDatas.messagesErreur.bSnackbar = true
                        lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) ne correspond pas au type choisi (${itemsType.value[i].label})`
                    }
                    break   
                }
            }
        }
    }
})

watch(() => lesDatas.file, (newValueFile, oldValueFile) => {
    if (newValueFile !== undefined && lesDatas.document.idFamille !== '') {
        let bTrouve = false
        let fileExtension = ''
        const posi = newValueFile.name.lastIndexOf('.')
        if (posi !== -1) {
            fileExtension = newValueFile.name.substr(posi+1)
            for (let i=0; i<itemsType.value.length; i++) {
                if (itemsType.value[i].label == fileExtension) {
                    lesDatas.document.idType = itemsType.value[i].value
                    bTrouve = true
                    break   
                }
            }
        }
        if (!bTrouve) {
            lesDatas.document.idType = ''
            lesDatas.messagesErreur.timeOutSnackbar = 10000
            lesDatas.messagesErreur.bSnackbar = true
            lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) n'est pas prévue pour cette famille de document`
       }    
    }

    if(newValueFile !== undefined) {
         //On vérifie que le fichier n'a pas déjà été indexé sur goéland
         verifieNouveauMD5()       
    }
})

watch(() => bDateOfficielleInconnue.value, () => {
    if (bDateOfficielleInconnue.value) {
        lesDatas.document.dateOfficielle = ''
        lesDatas.controle.bDataDateOfficielleOK = true
    } else if (lesDatas.document.dateOfficielle === '') {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est obligatoire ou signalée inconnue'         
    }
})

watch(() => bAuteurInconnu.value, () => {
    if (bAuteurInconnu.value) {
        lesDatas.document.idEmployeAuteur = 0
        lesDatas.document.acteurAuteur = []
    }
    lesDatas.controle.bDataAuteurOK = true
    if ((lesDatas.document.acteurAuteur.length == 0 && lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu.value)
        ||
        (lesDatas.document.idEmployeAuteur == 0 && lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu.value)) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
})

watch(() => lesDatas.document.documentIntExt, (newValueDIE) => {
    if (newValueDIE == 'docExterne') {
        lesDatas.document.idEmployeAuteur = 0
        txtEmployeAuteur.value = ''    
    } else if (newValueDIE == 'docInterne') {
        lesDatas.document.acteurAuteur = []
    }
})

watch(() => lesDatas.document.idEmployeAuteur, (newValueIdEA) => {
    lesDatas.controle.bDataAuteurOK = true
    if (newValueIdEA == 0 && lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu.value) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
})

watch(() => lesDatas.document.acteurAuteur, () => {
    lesDatas.controle.bDataAuteurOK = true
    if (lesDatas.document.acteurAuteur.length == 0 && lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu.value) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
}, { deep: true })

const auteurUser = () => {
    const oEmployeUser = {
        idemploye: lesDatas.user.idEmployeUser,
        nom: lesDatas.user.nomEmployeUser,
        prenom: lesDatas.user.prenomEmployeUser,
        unite: '',
    }
    receptionEmployeAuteur(lesDatas.user.idEmployeUser, JSON.stringify(oEmployeUser))
}
const receptionEmployeAuteur = (idemploye, jsonData) => {
    bChoixEmploye.value = false
    //console.log(jsonData)
    const oEmployeAuteur = JSON.parse(jsonData)
    lesDatas.document.idEmployeAuteur = oEmployeAuteur.idemploye
    txtEmployeAuteur.value = `${oEmployeAuteur.nom} ${oEmployeAuteur.prenom}. ${oEmployeAuteur.unite}`
}

const receptionActeurAuteur = (idacteur, jsonData) => {
    bChoixActeur.value = false
    console.log(jsonData)
    const oActeurAuteur = JSON.parse(jsonData)
    if (lesDatas.document.acteurAuteur.length > 0) {
        for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
            if (lesDatas.document.acteurAuteur[i].id == oActeurAuteur.acteurid) {
                return //déjà sélectionné
            }
        }
    }
    const acteurA = {
        id: oActeurAuteur.acteurid,
        nom: oActeurAuteur.acteurnom,
    }
    lesDatas.document.acteurAuteur.push(acteurA)
}

const supprimeActeurAuteur = (idacteur) => {
   if (lesDatas.document.acteurAuteur.length == 1) {
        lesDatas.document.acteurAuteur = [] 
    } else {
        for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
            if (lesDatas.document.acteurAuteur[i].id == idacteur) {
                lesDatas.document.acteurAuteur.splice(i, 1)
                break  
            }
        }       
    }
}
</script>