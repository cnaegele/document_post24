
<template>
  <Suspense>
  <v-app>
    <v-main>
      <AppToper />
      <DPDataInitialLoad 
        :codeConfigIni="configurationInitialData"
        :jsonConfigIni="jsonParams"
        :familletitre="familletitreParams"
        :nomfichiertitre="nomfichiertitreParams"
        :suitesauve="suitesauveParams"
        @postDocument="receptionDocumentPost"
      />
      <AppFooter/>
    </v-main>
  </v-app>
 </Suspense>

 <v-container v-if="configurationInitialData == 'generic'">
    <v-row dense>
      <v-col class="pt-4">Génération du titre du document</v-col>
      <v-col>
        <v-checkbox
          density="compact"
          v-model="chkGenNom"
          label="reprise du nom de fichier"
          value="filename"
        ></v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox
          density="compact"
          v-model="chkGenNom"
          label="famille au début"
          value="familledeb"
        ></v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox
          density="compact"
          v-model="chkGenNom"
          label="famille à la fin"
          value="famillefin"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row dense>
        <v-col>
          <v-select
            v-model="suitesauveParams"
            label="Comportement suite sauvegarde"
            :items="itemsSuiteSauve"
            item-title="label"
          ></v-select>
        </v-col>
    </v-row>
  </v-container>
  
</template>

<script setup>
import { ref, watch } from 'vue';
import DPDataInitialLoad from '@/components/DPDataInitialLoad.vue';

const urlParams = new URLSearchParams(window.location.search)
const chkGenNom = ref([])
const configurationInitialData = ref('')
const jsonParams = ref('')
const familletitreParams = ref('non')
const nomfichiertitreParams = ref('non')
const suitesauveParams = ref('emitinit')
const itemsSuiteSauve = ref([
  {label: `Réinitialisation des valeurs de champs après la sauvegarde`, value: 'emitinit'},
  {label: `Conservation des valeurs de champs après la sauvegarde`, value: 'emitkeep'},
  {label: `Ouvrir la page de consultation du document après la sauvegarde`, value: 'pagedata'},
  {label: `Ouvrir la page d'édition' du document après la sauvegarde`, value: 'pageedit'},
])

if (urlParams.has('configini')) {
  configurationInitialData.value = urlParams.get('configini')
}
if (urlParams.has('jsonprms')) {
  const jsonprms = urlParams.get('jsonprms')
  jsonParams.value = decodeURIComponent(jsonprms)
  //console.log(jsonParams.value)
  //console.log(encodeURIComponent(`{"titre":"Gare 22 - ","sujet":"#444","auteursacteur":[10000],"objetslies":[1000,10000]}"`))
}
if (urlParams.has('suitesauve')) {
  suitesauveParams.value = urlParams.get('suitesauve')
}
const receptionDocumentPost = (responseData) => {
  console.log(`receptionDocumentPost suite emit DPDataInitialLoad ${JSON.stringify(responseData)}`)
  if (window.opener && typeof window.opener.receptionDocuments24 === 'function') {
    window.opener.receptionDocuments24(JSON.stringify(responseData))
    window.self.close();
  }
}

watch(() => chkGenNom.value, (newval, oldval) => {
  let bFileName = false
  let bFamilleFinNew = false
  let bFamilleFinOld = false
  let bFamilleDebNew = false
  let bFamilleDebOld = false
  for (let i=0; i<newval.length; i++) {
    switch (newval[i]) {
      case 'filename': 
        bFileName = true
        break;
        case 'familledeb': 
        bFamilleDebNew = true
        break;
        case 'famillefin': 
        bFamilleFinNew = true
        break;
    }
  }
  //Traitement du cas famille début et famille fin choisi, il en faut 1 seul
  if (bFamilleDebNew && bFamilleFinNew) {
    for (let i=0; i<oldval.length; i++) {
      if (oldval[i] == 'familledeb') {
        bFamilleDebOld = true
      } else if (oldval[i] == 'famillefin') {
        bFamilleFinOld = true  
      }
    }
    //c'est celui qui n'était pas choisi qui va gagné
    if (!bFamilleDebOld) {
      if (bFileName) {
        chkGenNom.value = ['filename', 'familledeb']
      } else {
        chkGenNom.value = ['familledeb']
      }
    } else if (!bFamilleFinOld){
      bFamilleDebNew = false
      if (bFileName) {
        chkGenNom.value = ['filename', 'famillefin']
      } else {
        chkGenNom.value = ['famillefin']
      }
    }
  }

  if (bFileName) {
    nomfichiertitreParams.value = 'oui'
  } else {
    nomfichiertitreParams.value = 'non'
  }
  if (bFamilleDebNew) {
    familletitreParams.value = 'avant'
  }
  if (bFamilleFinNew) {
    familletitreParams.value = 'apres'
  }
  if (!bFamilleDebNew && !bFamilleFinNew) {
    familletitreParams.value = 'non'
  }
})
</script>
