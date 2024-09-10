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
                label="famille"
                item-title="label"
                :reduce="(item) => itemsFamille.value"
                placeholder="Sélectionner la famille du document"
            ></v-select>                     
        </v-col>
        <v-col cols="12" md="1"></v-col>
        <v-col cols="12" md="1" class="titreChampSaisie">Type</v-col>
        <v-col cols="12" md="2">
            <v-select
                v-model="lesDatas.document.idType"
                :items="itemsType"
                label="type"
                item-title="label"
                :reduce="(item) => itemsType.value"
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
    <v-row >
        <v-col cols="12" md="2" class="titreChampSaisie">Date officielle</v-col>
        <v-col cols="12" md="10">
            <div class="go_divdate">
                <input
                    type="date"
                    id="inpDateOfficielle"
                    class="go_input"
                    v-model="lesDatas.document.dateOfficielle"
                    @keyup="inpDateOfficiellekeyup"
                ></input>
                <span class="go-erreur">&nbsp;&nbsp;&nbsp;&nbsp;{{ messagesErreurDateDebut }}</span>
            </div>
        </v-col>
    </v-row>

  </v-container>
  </template>
  
 <script setup>
import { ref, toRefs, watch } from 'vue'
import { data } from '@/stores/data.js'
import { documentPostProps } from './DocumentPostProps.js'

const props = defineProps(documentPostProps)
const { famillestypes } = toRefs(props)
const { sizemax } = toRefs(props)

console.log(famillestypes.value)
console.log(sizemax.value)

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

const lesDatas = data()
const messagesErreurDateDebut = ref('')

const titreRules = [
    value => {
        if (value.trim().length >= 5) {
            return true
        }
        return 'Le titre est obligatoire et doit contenir au moins 5 caractères'
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
      messagesErreurDateDebut.value = 'la date officielle est invalide'
    } else {
      messagesErreurDateDebut.value = ''
    }
}
watch(() => lesDatas.document.dateOfficielle, () => {
    //Comme on utilise pas un composant vuetify
    //if faut faire l'equivalent des rules ici
    messagesErreurDateDebut.value = ''
    if (lesDatas.document.dateOfficielle === '') {
        messagesErreurDateDebut.value = 'la date officielle est obligatoire ou signalée inconnue'   
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
})
</script>