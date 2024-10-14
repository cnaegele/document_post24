<style scoped>
  .bactif0 {
    font-style: italic;
    color: rgb(252, 182, 182)
  }
  .bactif1 {
    font-style: normal;
  }
</style>
<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="8" md="8">
        <v-radio-group
          label="critère selon"
          v-model="critereType"
          inline
          density="compact">
          <v-radio label="nom" :value="'nom'"></v-radio>&nbsp;&nbsp;
          <v-radio label="nom début" :value="'nomdebut'"></v-radio>&nbsp;&nbsp;
          <v-radio label="id goéland" :value="'idgo'"></v-radio>&nbsp;&nbsp;
          <v-radio label="id CHE" :value="'idche'"></v-radio>&nbsp;&nbsp;
        </v-radio-group>  
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="8" md="2">
        <v-checkbox      
          v-model="bActeurMoral" 
          label="personnes morales"
          @click="onInputCritere">
        </v-checkbox>  
      </v-col>
      <v-col cols="8" md="2">
        <v-checkbox
          v-model="bActeurPhysique" 
          label="personnes physiques"
          @click="onInputCritere">
        </v-checkbox>  
      </v-col>
      <v-col cols="8" md="2">
         <v-checkbox
          v-model="bActeurDesactive" 
          label="y.c. acteurs désactivés"
          @click="onInputCritere">
        </v-checkbox>  
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
          :rules="critereRules"
          @input="onInputCritere"
        ></v-text-field>  
      </v-col>
    </v-row>
    <v-row v-if="messageErreur != ''">
      <v-col cols="8" md="8" v-html="messageErreur"></v-col>  
    </v-row>
    <v-row v-if="modeChoix=='multiple' && acteursListeChoisi.length > 0" no-gutters>
      <v-col cols="8" md="8">
        <v-list max-height="400">
          <v-list-subheader>
            Acteurs choisis ({{ acteursListeChoisi.length }})
            &nbsp;&nbsp;&nbsp;&nbsp;
            <v-btn
              rounded="lg"
              @click="choixTermine()"
            >Choix terminé</v-btn>
          </v-list-subheader>
          <v-list-item
            v-for="acteur in acteursListeChoisi"
              :key="acteur.acteurid"
              :value="acteur.acteurid"
              :title="acteur.acteurnom"
              :class="`bactif${acteur.bactif}`"
          >
          <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                @click="supprimeChoix(acteur.acteurid)"
              ></v-btn>
            </template>
        </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row v-if="modeChoix=='multiple' && acteursListeChoisi.length > 0" no-gutters>
      <v-col cols="8" md="8">
        &nbsp;
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="8" md="8">
        <v-list max-height="400">
          <v-list-subheader>{{ libelleListe }}</v-list-subheader>
          <v-list-item
            v-for="acteur in acteursListeSelect"
            :key="acteur.acteurid"
            :value="acteur.acteurid"
            :title="acteur.acteurnom"
            :class="`bactif${acteur.bactif}`"
            @click="choixActeur(acteur)"
          >
            <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-information"
                variant="text"
                @mouseenter="infoMouseEnter()"
                @mouseleave="infoMouseLeave()"
                @click="infoActeur(acteur.acteurid)"
              ></v-btn>
            </template>

          </v-list-item>
        </v-list>
      </v-col>  
    </v-row>
  </v-container>
  
  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCard"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
          <span class="cardTitre">Informations détaillées</span>
          <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCard"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
          <div v-if="acteurIdInfo != '0'">
            <Suspense><ActeurData :acteurId="acteurIdInfo"></ActeurData></Suspense>  
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { getActeursListe } from '@/axioscalls_acteur.js'
import ActeurData from '@/components/acteur/ActeurData.vue'

const props = defineProps({
  critereTypeInit: String,
  nombreMaximumRetour: String,
  modeChoix: String,
})
const messageErreur = ref('')
const libelleListe = ref('choix acteurs (0)')
const txtCritere = ref('')
const bActeurMoral = ref(true)
const bActeurPhysique = ref(true)
const bActeurDesactive = ref(false)
const inpTxtCritere = ref(null)
let critereType = ref('nom')
if (props.critereTypeInit !== undefined) {
  critereType = ref(props.critereTypeInit)
}
let bcritereRules
let nombreMaximumRetour = ref(100)
if (props.nombreMaximumRetour !== undefined) {
  nombreMaximumRetour = ref(props.nombreMaximumRetour)
}
let modeChoix = ref('unique')
if (props.modeChoix !== undefined) {
  modeChoix = ref(props.modeChoix)
}
const labelTextField = ref('nom')
const acteursListeSelect = ref([])
const acteursListeChoisi = ref([])
const acteurIdInfo = ref('0')

const critereRules = [
  value => {
    if (critereType.value == 'idgo') {
      if (!value) {
        bcritereRules = true
        return true
      }
      if (/^\+?(0|[1-9]\d*)$/.test(value)) {
        bcritereRules = true
        return true
      }
      bcritereRules = false
      return 'id goéland invalide, numérique'
    } else {
      bcritereRules = true
        return true
    }
  }
]

onMounted(() => {
  nextTick(() => {
    inpTxtCritere.value?.focus()
  })
})

watch(critereType, (newValue, oldValue) => {
  switch (newValue) {
    case 'nom':
    case 'nomdebut':
      labelTextField.value = 'nom'
      txtCritere.value = ''
      break
    case 'idgo':
      labelTextField.value = 'id acteur.value'
      txtCritere.value = ''
      break
    case 'idche':
      labelTextField.value = 'id fédéral (CHE-)'
      txtCritere.value = 'CHE-'
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
    prepareRechercheActeurs()
  }, typingInterval)

  inpTxtCritere.value.$el.querySelector('input').focus()
}

const prepareRechercheActeurs = () => {
  if (bcritereRules) {
    const critere = txtCritere.value
    const crType = critereType.value

    if (critere.length >= 1 && crType == 'nomdebut') {
      rechercheActeurs(critere, crType, nombreMaximumRetour.value)
    } else if (critere.length >= 3 && crType == 'nom') {
      rechercheActeurs(critere, crType, nombreMaximumRetour.value)
    } else if (critere.length >= 1 && crType == 'idgo') {
      rechercheActeurs(critere, crType, nombreMaximumRetour.value)
    } else if (critere.length >= 15 && crType == 'idche') {
      rechercheActeurs(critere, crType, nombreMaximumRetour.value)
    }
  }
}
const rechercheActeurs = async (critere, crType, nombreMaximumRetour) => {
  let sbActeurMoral, sbActeurPhysique, sbActeurDesactive, snombreMaximumRetour
  if (bActeurMoral.value == true) {
    sbActeurMoral = '1'  
  } else {
    sbActeurMoral = '0'  
  }
  if (bActeurPhysique.value == true) {
    sbActeurPhysique = '1'  
  } else {
    sbActeurPhysique = '0'  
  }
  if (bActeurDesactive.value == true) {
    sbActeurDesactive = '1'  
  } else {
    sbActeurDesactive = '0'  
  }
  snombreMaximumRetour = nombreMaximumRetour.toString()
  
  const oCritere = {
    "critere" : critere,
    "crtype" : crType,
    "bacteurmoral" : sbActeurMoral,
    "bacteurphysique" : sbActeurPhysique,
    "bacteurdesactive" : sbActeurDesactive,
    "nombremaximumretour" : snombreMaximumRetour
  }
  //console.log (JSON.stringify(oCritere))
  let acteursListe = await getActeursListe(JSON.stringify(oCritere))
  if (acteursListe.hasOwnProperty('message')) {
    messageErreur.value += acteursListe.message + '<br>'
    acteursListe = []
  }
  if (acteursListe.length < nombreMaximumRetour) {
    libelleListe.value = `Choix acteurs (${acteursListe.length})`
  } else {
    libelleListe.value = `Choix acteurs (${acteursListe.length}). Attention, plus de ${nombreMaximumRetour} acteurs correspondent aux critères`
  }
  //console.log(acteursListe)
  acteursListeSelect.value = acteursListe
}

let demandeInfoActeur = false
const emit = defineEmits(['choixActeur'])

const choixActeur = (acteur) => {
  if (demandeInfoActeur == false) {
    if (modeChoix.value == 'unique') {
      emit('choixActeur', acteur.acteurid, JSON.stringify(acteur))
    } else if (modeChoix.value == 'multiple') {
      if (acteursListeChoisi.value.some(objet => objet.acteurid === acteur.acteurid) === false) {
        acteursListeChoisi.value.push(acteur)
      }
    }
  }
}

const supprimeChoix = (acteurid) => {
  acteursListeChoisi.value = acteursListeChoisi.value.filter(objet => objet.acteurid !== acteurid)  
}

const choixTermine = () => {
  emit('choixActeur', 0, JSON.stringify(acteursListeChoisi.value))
  acteursListeChoisi.value = [] 
}

const infoMouseEnter = () => {
  demandeInfoActeur = true
  //console.log("souris sur info")
}
const infoMouseLeave = () => {
  demandeInfoActeur = false
  //console.log("souris quitte info")
}
const infoActeur = (acteurId) => {
  acteurIdInfo.value = acteurId.toString()
  document.getElementById("btnActiveCard").click() 
}
const closeCard = () => {
  acteurIdInfo.value = '0'
  document.getElementById("btnActiveCard").click()    
}

</script>