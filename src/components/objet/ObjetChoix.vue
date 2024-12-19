<template>
    <v-card>
      <v-tabs
        v-model="tabchoisi"
        bg-color="primary"
      >
        <v-tab value="batiment">Bâtiments</v-tab>
        <v-tab value="parcelle">Parcelles</v-tab>
        <v-tab value="rue">Rues</v-tab>
        <v-tab value="bpadresse">Bâtiments et parcelles par adresse</v-tab>
        <v-tab value="autre">Autres objets</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-tabs-window v-model="tabchoisi">
          <v-tabs-window-item value="batiment">
            Bâtiments...
          </v-tabs-window-item>
  
          <v-tabs-window-item value="parcelle">
            Parcelles...
          </v-tabs-window-item>
  
          <v-tabs-window-item value="rue">
            Rues...
          </v-tabs-window-item>

          <v-tabs-window-item value="bpadresse">
            sélection d'une adresse
            <div>
                <AdresseChoix 
                    critereTypeInit="nom"
                    nombreMaximumRetour="100"
                    :modeChoix="'unique'"
                    @choixAdresse="receptionAdresse"
                />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="autre">
            Autres objets...
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </template>

<script setup>
import {ref} from 'vue'
import AdresseChoix from '@/components/adresse/AdresseChoix.vue'

const tabchoisi = ref(null)

let modeChoix = ref('unique')
let demandeObjetInfo = false
const objetsListeSelect = ref([])
const objetsListeChoisi = ref([])


const emit = defineEmits(['choixObjet'])

const choixObjet = (objet) => {
  if (demandeObjetInfo == false) {
    if (modeChoix.value == 'unique') {
      emit('choixObjet', objet.idobjet, JSON.stringify(objet))
    } else if (modeChoix.value == 'multiple') {
      if (objetsListeChoisi.value.some(obj => obj.idobjet === objet.idobjet) === false) {
        objetsListeChoisi.value.push(objet)
      }
    }
  }
}

const receptionAdresse = (idadresse, jsonData) => {
    console.log(jsonData)
    const oAdresse = JSON.parse(jsonData)
    console.log(oAdresse)
    //todo traiter le retour adresse...
    const objet = {"id":0, "nom":"viendra de adresse"}
    choixObjet(objet)

    //closeCardAdresseChoix()
    //closeCardObjetChoix()
}

const supprimeChoix = (idobjet) => {
    objetsListeChoisi.value = objetsListeChoisi.value.filter(objet => objet.idadresse !== idobjet)  
}

const choixTermine = () => {
  emit('choixObjet', 0, JSON.stringify(objetsListeChoisi.value))
  objetsListeChoisi.value = [] 
}

const infoMouseEnter = () => {
  demandeOpenGC = true
}
const infoMouseLeave = () => {
  demandeOpenGC = false
}
</script>