
<template>
  <Suspense>
  <v-app>
    <v-main>
      <AppToper />
      <DPDataInitialLoad 
        :codeConfigIni="configurationInitialData"
        :jsonConfigIni="jsonParams"
        :suitesauve="suitesauveParams"
        @postDocument="receptionDocumentPost"
      />
      <AppFooter/>
    </v-main>
  </v-app>
 </Suspense>

 <v-container v-if="configurationInitialData == 'generic'">
    <v-row>
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
import { ref } from 'vue';
import DPDataInitialLoad from '@/components/DPDataInitialLoad.vue';

const urlParams = new URLSearchParams(window.location.search)
const configurationInitialData = ref('')
const jsonParams = ref('')
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
</script>
