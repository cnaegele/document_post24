
<template>
  <Suspense>
  <v-app>
    <v-main>
      <AppToper />
      <DataInitialLoad />
    
    </v-main>
  </v-app>
 </Suspense>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios'
import { dataini } from '@/stores/dataini.js'
import DataInitialLoad from './components/DataInitialLoad.vue';

const lesDatasIni = dataini()
console.log(lesDatasIni.titre)

//Définition des propriété du composant

//onMounted(dataLoaded.value = true)


const urlParams = new URLSearchParams(window.location.search)
let configurationInitialData = ''
if (urlParams.has('configini')) {
  configurationInitialData = ref(urlParams.get('configini'))
}


</script>
