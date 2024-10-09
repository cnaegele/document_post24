
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
</template>


<script setup>
import { ref } from 'vue';
import DPDataInitialLoad from './components/DPDataInitialLoad.vue';

const urlParams = new URLSearchParams(window.location.search)
const configurationInitialData = ref('')
const jsonParams = ref('')
const suitesauveParams = ref('')

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
  console.log(`receptionDocumentPost suite emit ${JSON.stringify(responseData)}`)
}
</script>
