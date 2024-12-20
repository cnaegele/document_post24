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
    <v-container>
      <v-row v-if="messageErreur != ''">
        <v-col cols="8" md="8" v-html="messageErreur"></v-col>  
      </v-row>
      <v-row v-if="modeChoix=='multiple' && objetsListeChoisi.length > 0" no-gutters>
        <v-col cols="8" md="8">
          <v-list max-height="400">
            <v-list-subheader>
              Objets choisis ({{ objetsListeChoisi.length }})
              &nbsp;&nbsp;&nbsp;&nbsp;
              <v-btn
                rounded="lg"
                @click="choixTermine()"
              >Choix terminé</v-btn>
            </v-list-subheader>
            <v-list-item
              v-for="objet in objetsListeChoisi"
                :key="objet.id"
                :value="objet.id"
                :title="objet.nom"
            >
            <template v-slot:append>
                <v-btn
                  color="grey-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click="supprimeChoix(objet.id)"
                ></v-btn>
              </template>
          </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row v-if="modeChoix=='multiple' && objetsListeChoisi.length > 0" no-gutters>
        <v-col cols="8" md="8">
          &nbsp;
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="8" md="8">
          <v-list max-height="400">
            <v-list-subheader>{{ libelleListe }}</v-list-subheader>
            <v-list-item
              v-for="objet in objetsListeSelect"
              :key="objet.id"
              :value="objet.id"
              :title="objet.nom"
              @click="choixObjet(objet)"
            >
              <!--
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
              -->
            </v-list-item>
          </v-list>
        </v-col>  
      </v-row>
    </v-container>
  </template>

<script setup>
import {ref} from 'vue'
import AdresseChoix from '@/components/adresse/AdresseChoix.vue'
import { parcelleListeParAdresse } from '@/axioscalls_objet.js'

const props = defineProps({
  modeChoix: String,
})

const tabchoisi = ref(null)

let modeChoix = ref('unique')
if (props.modeChoix !== undefined) {
  modeChoix = ref(props.modeChoix)
}
let demandeObjetInfo = false
const objetsListeSelect = ref([])
const objetsListeChoisi = ref([])
const messageErreur = ref('')
const libelleListe = ref('choix objets (0)')

const emit = defineEmits(['choixObjet'])

const choixObjet = (objet) => {
  if (demandeObjetInfo == false) {
    if (modeChoix.value == 'unique') {
      emit('choixObjet', objet.id, JSON.stringify(objet))
    } else if (modeChoix.value == 'multiple') {
      if (objetsListeChoisi.value.some(obj => obj.id === objet.id) === false) {
        objetsListeChoisi.value.push(objet)
      }
    }
  }
}

const receptionAdresse = async (idadresse, jsonData) => {
    //console.log(jsonData)
    const oAdresse = JSON.parse(jsonData)
    let aoAdresse = []
    if (!Array.isArray(oAdresse)) {
      aoAdresse.push(oAdresse)  
    } else {
      aoAdresse = oAdresse 
    }
    //console.log(aoAdresse)
    for (let i=0; i<aoAdresse.length; i++) {
      const oCritere = {
        "idadresse" : aoAdresse[i].idadresse,
      }
      const parcellesListe = await parcelleListeParAdresse(JSON.stringify(oCritere))
      //console.log(parcellesListe)
      for (let ip=0; ip<parcellesListe.length; ip++) {
        const objet = {"id" : parcellesListe[ip].idobjet, "nom" : parcellesListe[ip].nomobjet}
        choixObjet(objet)
      }
    }
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