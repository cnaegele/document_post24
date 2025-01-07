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
            <div class="d-flex align-items-baseline">
              <span class="me-2 mt-3">critère selon :</span>
              <v-radio-group v-model="typeCritereBatiment" inline>
                <v-radio label="nom" value="nom"></v-radio>
                <v-radio label="n° ECA" value="eca"></v-radio>
                <v-radio label="egid" value="egid"></v-radio>
              </v-radio-group>            
            </div>  
            <v-text-field
                dense
                v-model="critereBatiment"
                ref="inpTxtCritereBatiment"
                :label="libelleInpCritereBatiment"
                style="width: 400px;"
                :rules="critereBatimentRule"
                @input="onInputCritereBatiment"
              ></v-text-field> 
          </v-tabs-window-item>
  
          <v-tabs-window-item value="parcelle">
            <div class="d-flex align-items-baseline">
              <span class="me-2 mt-3">critère selon :</span>
              <v-radio-group v-model="typeCritereParcelle" inline>
                <v-radio label="n° parcelle" value="numero"></v-radio>
                <v-radio label="n° ECA" value="eca"></v-radio>
                <v-radio label="egrid" value="egrid"></v-radio>
              </v-radio-group>            
            </div>  
            <v-text-field
                dense
                v-model="critereParcelle"
                ref="inpTxtCritereParcelle"
                :label="libelleInpCritereParcelle"
                style="width: 180px;"
                :rules="critereParcelleRule"
                @input="onInputCritereParcelle"
              ></v-text-field> 
          </v-tabs-window-item>
  
          <v-tabs-window-item value="rue">
            Rues...
          </v-tabs-window-item>

          <v-tabs-window-item value="bpadresse">
            <div class="d-flex align-center">
              <span class="me-4"><h3>Sélection d'une adresse</h3></span>
              <v-radio-group
                label="retour"
                v-model="retourParAdresseType"
                inline
                density="compact">
                <v-radio label="bâtiment et parcelle" :value="'batpar'"></v-radio>&nbsp;&nbsp;
                <v-radio label="bâtiment" :value="'bat'"></v-radio>&nbsp;&nbsp;
                <v-radio label="parcelle" :value="'par'"></v-radio>&nbsp;&nbsp;
              </v-radio-group> 
            </div> 

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
import {ref, watch} from 'vue'
import AdresseChoix from '@/components/adresse/AdresseChoix.vue'
import { batimentListe, parcelleListe, batimentListeParAdresse, parcelleListeParAdresse } from '@/axioscalls_objet.js'

const props = defineProps({
  nombreMaximumRetour: String,
  modeChoix: String,
})

const tabchoisi = ref(null)
const typeCritereBatiment = ref('nom')
const critereBatiment = ref('')
let bCritereBatimentEgidOK = true
const libelleInpCritereBatiment = ref('nom bâtiment')
const inpTxtCritereBatiment = ref(null)
const typeCritereParcelle = ref('numero')
const critereParcelle = ref('')
let bCritereParcelleEgridOK = true
const libelleInpCritereParcelle = ref('n° parcelle')
const inpTxtCritereParcelle = ref(null)
const retourParAdresseType = ref('batpar')

watch(() => typeCritereBatiment.value, () => {
  switch (typeCritereBatiment.value) {
    case 'nom':
      libelleInpCritereBatiment.value = 'nom bâtiment'
      break
    case 'eca':
      libelleInpCritereBatiment.value = 'n° ECA'
      break
    case 'egid':
      libelleInpCritereBatiment.value = 'egid'
      inpTxtCritereBatiment.value.validate()
      break
  }
  prepareRechercheBatiments()
})

const critereBatimentRule = [
    value => {
      if (value !== '') {
        if (typeCritereBatiment.value == 'egid') {
          if (/^\+?(0|[1-9]\d*)$/.test(value) === false) {
            bCritereBatimentEgidOK = false
            return `l'egid doit être numérique`
          }
          if (value <= 0 || value > 9999999999) {
            bCritereBatimentEgidOK = false
            return `l'egid doit être positif et 10 chiffres au maximum`
          }
        }
      }
      bCritereBatimentEgidOK = true
      return true
    }
]

watch(() => typeCritereParcelle.value, () => {
  switch (typeCritereParcelle.value) {
    case 'numero':
      libelleInpCritereParcelle.value = 'n° parcelle'
      break
    case 'eca':
      libelleInpCritereParcelle.value = 'n° ECA'
      break
    case 'egrid':
      libelleInpCritereParcelle.value = 'egrid'
      inpTxtCritereParcelle.value.validate()
      break
  }
  prepareRechercheParcelles()
})

const critereParcelleRule = [
    value => {
      if (value !== '') {
        if (typeCritereParcelle.value == 'egrid') {
          if (/^ch(0|[1-9]\d*)[\*]?$/i.test(value) === false) {
            bCritereParcelleEgridOK = false
            return `l'egrid doit être de la forme CH{numérique}`
          }
        }
      }
      bCritereParcelleEgridOK = true
      return true
    }
]


let nombreMaximumRetour = ref(100)
if (props.nombreMaximumRetour !== undefined) {
  nombreMaximumRetour = ref(props.nombreMaximumRetour)
}

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

//pour démarrer la recherche seulement si la frappe au clavier a cessé depuis 0.7 secondes
let typingTimer
const typingInterval = 700
const onInputCritereBatiment = () => {
  //console.log('oninput')
  clearTimeout(typingTimer)
  
  typingTimer = setTimeout(() => {
    prepareRechercheBatiments()
  }, typingInterval)

  inpTxtCritereBatiment.value.$el.querySelector('input').focus()
}

const prepareRechercheBatiments = () => {
  const critereBat = critereBatiment.value.trim()
  if (critereBat !== '') {
    switch (typeCritereBatiment.value) {
      case 'nom':
        if (critereBat.length >= 3) {
          rechercheBatiments('nom', critereBat)  
        }
        break
      case 'eca':
        rechercheBatiments('eca', critereBat)  
      break
      case 'egid':
        if (bCritereBatimentEgidOK) {
          rechercheBatiments('egid', critereBat)
        }
        break
    }
    //console.log('prepareRechercheBatiments')
  }
}
const rechercheBatiments = async (crType, critere) => {
  const oCritere = {
    "crtype" : crType,
    "critere" : critere,
    "nombremaximumretour" : nombreMaximumRetour.value
  }
  console.log (JSON.stringify(oCritere))
  let objetsListe = await batimentListe(JSON.stringify(oCritere))
  //console.log(objetsListe)
  if (objetsListe.hasOwnProperty('message')) {
      messageErreur.value += objetsListe.message + '<br>'
      objetsListe = []
  }
  if (objetsListe.length < nombreMaximumRetour.value) {
      libelleListe.value = `Choix bâtiments (${objetsListe.length})`
  } else {
      libelleListe.value = `Choix bâtiments (${objetsListe.length}). Attention, plus de ${nombreMaximumRetour.value} bâtiments correspondent aux critères`
  }
  objetsListeSelect.value = objetsListe
}

const onInputCritereParcelle = () => {
  //console.log('oninput')
  clearTimeout(typingTimer)
  
  typingTimer = setTimeout(() => {
    prepareRechercheParcelles()
  }, typingInterval)

  inpTxtCritereParcelle.value.$el.querySelector('input').focus()
}

const prepareRechercheParcelles = () => {
  const criterePar = critereParcelle.value.trim()
  if (criterePar !== '') {
    switch (typeCritereParcelle.value) {
      case 'numero':  
        rechercheParcelles('numero', criterePar)  
        break
      case 'eca':
        rechercheParcelles('eca', criterePar)  
      break
      case 'egrid':
        if (bCritereParcelleEgridOK) {
          rechercheParcelles('egrid', criterePar)
        }
        break
    }
    //console.log('prepareRechercheParcelles')
  }
}
const rechercheParcelles = async (crType, critere) => {
  const oCritere = {
    "crtype" : crType,
    "critere" : critere,
    "nombremaximumretour" : nombreMaximumRetour.value
  }
  //console.log (JSON.stringify(oCritere))
  let objetsListe = await parcelleListe(JSON.stringify(oCritere))
  //console.log(objetsListe)
  if (objetsListe.hasOwnProperty('message')) {
      messageErreur.value += objetsListe.message + '<br>'
      objetsListe = []
  }
  if (objetsListe.length < nombreMaximumRetour.value) {
      libelleListe.value = `Choix parcelles (${objetsListe.length})`
  } else {
      libelleListe.value = `Choix parcelles (${objetsListe.length}). Attention, plus de ${nombreMaximumRetour.value} parcelles correspondent aux critères`
  }
  objetsListeSelect.value = objetsListe
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
      if (retourParAdresseType.value == 'batpar' || retourParAdresseType.value == 'bat') {
        const oCritereBatiment = {
          "idadresse" : aoAdresse[i].idadresse,
        }
        const batimentsListe = await batimentListeParAdresse(JSON.stringify(oCritereBatiment))
        //console.log(batimentsListe)
        for (let ib=0; ib<batimentsListe.length; ib++) {
          const objet = {"id" : batimentsListe[ib].idobjet, "nom" : batimentsListe[ib].nomobjet}
          choixObjet(objet)
        }
      }

      if (retourParAdresseType.value == 'batpar' || retourParAdresseType.value == 'par') {
        const oCritereParcelle = {
          "idadresse" : aoAdresse[i].idadresse,
        }
        const parcellesListe = await parcelleListeParAdresse(JSON.stringify(oCritereParcelle))
        //console.log(parcellesListe)
        for (let ip=0; ip<parcellesListe.length; ip++) {
          const objet = {"id" : parcellesListe[ip].idobjet, "nom" : parcellesListe[ip].nomobjet}
          choixObjet(objet)
        }
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