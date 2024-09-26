
<template>
  <Suspense>
  <v-app>
    <v-main>
      <AppToper />
      <DataInitialLoad :codeConfigIni="configurationInitialData"/>
      <AppFooter/>
    </v-main>
  </v-app>
 </Suspense>
</template>


<script setup>
import { ref } from 'vue';
import DataInitialLoad from './components/DataInitialLoad.vue';

const urlParams = new URLSearchParams(window.location.search)
let configurationInitialData = ''
if (urlParams.has('configini')) {
  configurationInitialData = ref(urlParams.get('configini'))
}


</script>
