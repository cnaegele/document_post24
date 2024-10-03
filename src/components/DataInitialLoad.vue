<template>
  <v-snackbar
    color="#FFCDD2"
    multi-line
    location="center"
    v-model="bSnackbar"
    :timeout="-1"
  >
    <div v-html="message"></div>
    <template v-slot:actions>
      <v-btn
        text="Fermer"
        variant="tonal"
        @click="bSnackbar = false"
      ></v-btn>
    </template>
  </v-snackbar>
    <DocumentPost
        :libelle="lesDatasIni.libelle"
        :titre="lesDatasIni.titre"
        :famillestypes="lesDatasIni.famillestypes"
        :sujet="lesDatasIni.sujet"
        :auteuremploye="lesDatasIni.auteuremploye"
        :auteursacteur="lesDatasIni.auteursacteur"
        :objetslies="lesDatasIni.objetslies"
        :idniveauconfidentialite="lesDatasIni.idniveauconfidentialite"
        :sizemax="lesDatasIni.sizemax"
        suitesauve="init"
        @postDocument="receptionDocumentPost"
    ></DocumentPost>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { documentPostPropsIni } from '../configurationini.js'
//codeConfigIni renvoie vers un fichier de configuration
//jsonConfigIni est une chaine json de configuration
//Si les 2 sont utilisés, pour les éventuels paramètres présents 2x
//c'est ceux trouvés dans jsonConfigIni qui prennent le dessus 
const props = defineProps({
  codeConfigIni: {
      type: String,
      default() {
        return ''
      } 
    },
    jsonConfigIni: {
      type: String,
      default() {
        return ''
      } 
    },
})
const { codeConfigIni } = toRefs(props)
const { jsonConfigIni } = toRefs(props)
//console.log(codeConfigIni.value)
let configIni = null
//console.log(jsonConfigIni.value)
if (jsonConfigIni.value !== '') {
  configIni = JSON.parse(jsonConfigIni.value)
  //console.log(configIni)  
}

const lesDatasIni = ref(
  {
    libelle: '',
    titre:  '',
    famillestypes: [],
    sujet:  '',
    auteuremploye: '', // exemple: 7
    auteursacteur: [], // exemple: [10000,10001]  
    objetslies: [],    // exemple: [1000,10000]
    idniveauconfidentialite: '1',
    sizemax: 10000000,
  }
)

const bSnackbar = ref(false)
const message = ref('')
//C'est documentPostPropsIni qui gère codeConfigIni pas passé en revoyant une configuration par défaut
const propsIni =  await documentPostPropsIni(codeConfigIni.value)
//console.log(`propsini: ${JSON.stringify(propsIni)}`)
if (propsIni.hasOwnProperty("libelle")) {
    lesDatasIni.value.libelle = propsIni.libelle
}
if (propsIni.hasOwnProperty("titre")) {
    lesDatasIni.value.titre = propsIni.titre
}
if (propsIni.hasOwnProperty("famillestypes")) {
    lesDatasIni.value.famillestypes = propsIni.famillestypes
}
if (propsIni.hasOwnProperty("sujet")) {
    lesDatasIni.value.sujet = propsIni.sujet
}
if (propsIni.hasOwnProperty("auteuremploye")) {
    lesDatasIni.value.auteuremploye = propsIni.auteuremploye
}
if (propsIni.hasOwnProperty("auteursacteur")) {
    lesDatasIni.value.auteursacteur = propsIni.auteursacteur
}
if (propsIni.hasOwnProperty("objetslies")) {
    lesDatasIni.value.objetslies = propsIni.objetslies
}
if (propsIni.hasOwnProperty("idniveauconfidentialite")) {
    lesDatasIni.value.idniveauconfidentialite = propsIni.idniveauconfidentialite
}
if (propsIni.hasOwnProperty("sizemax")) {
    lesDatasIni.value.sizemax = propsIni.sizemax
}

if (configIni !== null) {
  if (configIni.hasOwnProperty("titre")) {
    lesDatasIni.value.titre = configIni.titre
  }
  if (configIni.hasOwnProperty("sujet")) {
    lesDatasIni.value.sujet = configIni.sujet
  }
  if (configIni.hasOwnProperty("auteuremploye")) {
    lesDatasIni.value.auteuremploye = configIni.auteuremploye
  }
  if (configIni.hasOwnProperty("auteursacteur")) {
    lesDatasIni.value.auteursacteur = configIni.auteursacteur
  }
  if (configIni.hasOwnProperty("objetslies")) {
    lesDatasIni.value.objetslies = configIni.objetslies
  }
  // exemple : /?jsonprms=%7B"titre"%3A"Gare%2022%20-%20"%2C"sujet"%3A"%23444"%2C"auteursacteur"%3A%5B10000%5D%2C"objetslies"%3A%5B1000%2C10000%5D%7D
  // avec : %7B"titre"%3A"Gare%2022%20-%20"%2C"sujet"%3A"%23444"%2C"auteursacteur"%3A%5B10000%5D%2C"objetslies"%3A%5B1000%2C10000%5D%7D 
  //qui est le encodeURIComponent de: {"titre":"Gare 22 - ","sujet":"#444","auteursacteur":[10000],"objetslies":[1000,10000]}
}
//console.log(lesDatasIni.value)

const receptionDocumentPost = (responseData) => {
  console.log(`receptionDocumentPost suite emit ${JSON.stringify(responseData)}`)
  //const oDocument = JSON.parse(jsonData)
  const success = responseData.success
  if (success) {
    const idDocument = responseData.iddocument
    //document.location.href = "https://mygolux.lausanne.ch/goeland/document/document_data.php?iddocument="+idDocument
  } else {
    bSnackbar.value = true
    message.value = responseData.message 
  }
}
</script>