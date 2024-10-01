
<template>
  <Suspense>
  <v-app>
    <v-main>
      <AppToper />
      <DataInitialLoad 
        :codeConfigIni="configurationInitialData"
        :jsonConfigIni="jsonParams"
      />
      <AppFooter/>
    </v-main>
  </v-app>
 </Suspense>
</template>


<script setup>
import { ref } from 'vue';
import DataInitialLoad from './components/DataInitialLoad.vue';

const urlParams = new URLSearchParams(window.location.search)
const configurationInitialData = ref('')
const jsonParams = ref('')
if (urlParams.has('configini')) {
  configurationInitialData.value = urlParams.get('configini')
}
if (urlParams.has('jsonprms')) {
  const jsonprms = urlParams.get('jsonprms')
  jsonParams.value = decodeURIComponent(jsonprms)
  //console.log(jsonParams.value)
}

</script>
