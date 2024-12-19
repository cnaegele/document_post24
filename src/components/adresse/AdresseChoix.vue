<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="8" md="8">
        <v-radio-group
          label="critère selon"
          v-model="critereType"
          inline
          density="compact">
          <v-radio label="début nom principal rue, numéro" :value="'nom'"></v-radio>&nbsp;&nbsp;
          <v-radio label="adresse complète, numéro" :value="'nomcomplet'"></v-radio>&nbsp;&nbsp;
        </v-radio-group>  
      </v-col>
    </v-row>
    <v-row  no-gutters>
      <v-col cols="8" md="4">
        <v-text-field 
          clearable 
          v-model="txtCritere"
          ref="inpTxtCritere"
          autofocus 
          :label="labelTextField"
          @input="onInputCritere"
        ></v-text-field>  
      </v-col>
    </v-row>
    <v-row v-if="messageErreur != ''">
      <v-col cols="8" md="8" v-html="messageErreur"></v-col>  
    </v-row>
    <v-row v-if="modeChoix=='multiple' && adressesListeChoisi.length > 0" no-gutters>
      <v-col cols="8" md="8">
        <v-list max-height="400">
          <v-list-subheader>
            Adresses choisies ({{ adressesListeChoisi.length }})
            &nbsp;&nbsp;&nbsp;&nbsp;
            <v-btn
              rounded="lg"
              @click="choixTermine()"
            >Choix terminé</v-btn>
          </v-list-subheader>
          <v-list-item
            v-for="adresse in adressesListeChoisi"
              :key="adresse.idadresse"
              :value="adresse.idadresse"
              :title="`${adresse.rue} ${adresse.numero}`"
         >
          <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                @click="supprimeChoix(adresse.idadresse)"
              ></v-btn>
            </template>
        </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row v-if="modeChoix=='multiple' && adressesListeChoisi.length > 0" no-gutters>
      <v-col cols="8" md="8">
        &nbsp;
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="8" md="8">
        <v-list max-height="400">
          <v-list-subheader>{{ libelleListe }}</v-list-subheader>
          <v-list-item
            v-for="adresse in adressesListeSelect"
            :key="adresse.idadresse"
            :value="adresse.idadresse"
            :title="`${adresse.rue} ${adresse.numero}`"
            @click="choixAdresse(adresse)"
          >
            <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-map-outline"
                variant="text"
                @mouseenter="infoMouseEnter()"
                @mouseleave="infoMouseLeave()"
                @click="openGC(adresse.coordeo, adresse.coordsn)"
              ></v-btn>
            </template>

          </v-list-item>
        </v-list>
      </v-col>  
    </v-row>

  </v-container>  
</template>
<script setup>
import {ref, onMounted, nextTick, watch} from 'vue'
import { getAdressesListe } from '@/axioscalls_adresse.js'

const props = defineProps({
  critereTypeInit: String,
  nombreMaximumRetour: String,
  modeChoix: String,
})

let critereType = ref('nom')
if (props.critereTypeInit !== undefined) {
  critereType = ref(props.critereTypeInit)
}
let nombreMaximumRetour = ref(100)
if (props.nombreMaximumRetour !== undefined) {
  nombreMaximumRetour = ref(props.nombreMaximumRetour)
}
let modeChoix = ref('unique')
if (props.modeChoix !== undefined) {
  modeChoix = ref(props.modeChoix)
}

const adressesListeSelect = ref([])
const adressesListeChoisi = ref([])
const messageErreur = ref('')
const libelleListe = ref('choix adresses (0)')
const txtCritere = ref('')
const labelTextField = ref('nom')
const inpTxtCritere = ref(null)

onMounted(() => {
  nextTick(() => {
    inpTxtCritere.value?.focus()
  })
})

watch(critereType, (newValue, oldValue) => {
  switch (newValue) {
    case 'nom':
    case 'nomcomplet':
      labelTextField.value = 'adresse'
      txtCritere.value = ''
      break
  }
  onInputCritere()
})

//pour démarrer la recherche seulement si la frappe au clavier a cessé depuis 0.7 secondes
let typingTimer
const typingInterval = 700
const onInputCritere = () => {
  //console.log('oninput')
  clearTimeout(typingTimer)
  
  typingTimer = setTimeout(() => {
    prepareRechercheAdresses()
  }, typingInterval)

  inpTxtCritere.value.$el.querySelector('input').focus()
}

const prepareRechercheAdresses = () => {
    const critere = txtCritere.value.replace(',', '').trim()
    const crType = critereType.value
    let critereRue = critere
    let critereNumero = ''
    let critereNumExt = ''
    if ((crType == 'nom' && critere.length >= 2) || (crType == 'nomcomplet' && critere.length >= 4)) {
        //recherche d'un éventuel numéro, de 1 à 4 chiffres
        const cherchenumero = critere.match(/(?:\D|^)([1-9]|[1-9]\d{1,3})(?=\D|$)/)
        if (cherchenumero) {
            const numero = cherchenumero[1]
            //On regarde ce qu'il y a avant et après le numéro
            const posi = critere.indexOf(numero)
            const avantNumero = critere.substring(0, posi).trim()
            const apresNumero = critere.substring(posi+numero.length).trim()
            if (apresNumero.length <= 4) {
                //il faut supporter le gbis de lausanne mais si on a plus, on a quelque chose du genre "24 janvier" "chemin des 3 fontaines" 
                critereRue = avantNumero
                critereNumero = numero    
                critereNumExt = apresNumero    
            }
        }
        rechercheAdresses(crType, critereRue, critereNumero, critereNumExt, nombreMaximumRetour.value)
    }
}
const rechercheAdresses = async (crType, critereRue, critereNumero, critereNumExt, nombreMaximumRetour) => {
    const oCritere = {
        "crtype" : crType,
        "critererue" : critereRue,
        "criterenumero" : critereNumero,
        "criterenumeroext" : critereNumExt,
        "nombremaximumretour" : nombreMaximumRetour.toString()
    }
    console.log (JSON.stringify(oCritere))

    let adressesListe = await getAdressesListe(JSON.stringify(oCritere))
    //console.log(adressesListe)
    if (adressesListe.hasOwnProperty('message')) {
        messageErreur.value += adressesListe.message + '<br>'
        adressesListe = []
    }
    if (adressesListe.length < nombreMaximumRetour) {
        libelleListe.value = `Choix adresses (${adressesListe.length})`
    } else {
        libelleListe.value = `Choix adresses (${adressesListe.length}). Attention, plus de ${nombreMaximumRetour} adresses correspondent aux critères`
    }
    adressesListeSelect.value = adressesListe
}

let demandeOpenGC = false
const emit = defineEmits(['choixAdresse'])

const choixAdresse = (adresse) => {
  if (demandeOpenGC == false) {
    if (modeChoix.value == 'unique') {
      emit('choixAdresse', adresse.idadresse, JSON.stringify(adresse))
    } else if (modeChoix.value == 'multiple') {
      if (adressesListeChoisi.value.some(objet => objet.idadresse === adresse.idadresse) === false) {
        adressesListeChoisi.value.push(adresse)
      }
    }
  }
}

const supprimeChoix = (idadresse) => {
  adressesListeChoisi.value = adressesListeChoisi.value.filter(objet => objet.idadresse !== idadresse)  
}

const choixTermine = () => {
  emit('choixAdresse', 0, JSON.stringify(adressesListeChoisi.value))
  adressesListeChoisi.value = [] 
}

const infoMouseEnter = () => {
  demandeOpenGC = true
}
const infoMouseLeave = () => {
  demandeOpenGC = false
}
const openGC = (x, y) => {
  window.open(`https://carto.lausanne.ch/?map_x=${x}&map_y=${y}y&map_zoom=7`, "gclausanne")
}
</script>