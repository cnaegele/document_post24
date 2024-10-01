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
        :objetslies="lesDatasIni.objetslies"
        :idniveauconfidentialite="lesDatasIni.idniveauconfidentialite"
        :sizemax="lesDatasIni.sizemax"
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
    objetslies: [],
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
if (propsIni.hasOwnProperty("idniveauconfidentialite")) {
    lesDatasIni.value.idniveauconfidentialite = propsIni.idniveauconfidentialite
}
if (propsIni.hasOwnProperty("sizemax")) {
    lesDatasIni.value.sizemax = propsIni.sizemax
}
if (propsIni.hasOwnProperty("objetslies")) {
    lesDatasIni.value.objetslies = propsIni.objetslies
}

if (configIni !== null) {
  if (configIni.hasOwnProperty("objetslies")) {
    lesDatasIni.value.objetslies = configIni.objetslies
  }
}
//console.log(lesDatasIni.value)

const receptionDocumentPost = (responseData) => {
  console.log(`receptionDocumentPost suite emit ${responseData}`)
  //const oDocument = JSON.parse(jsonData)
  const success = responseData.success
  if (success) {
    const idDocument = responseData.iddocument
    document.location.href = "https://mygolux.lausanne.ch/goeland/document/document_data.php?iddocument="+idDocument
  } else {
    bSnackbar.value = true
    message.value = responseData.message 
  }
}
</script>