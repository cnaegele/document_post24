<style scoped>

.floating-btn {
  position: fixed;
  bottom: 50px;
  left: 50px;
  z-index: 100;
}
</style>

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
  <Suspense>
  <DocumentPost
      :libelle="lesDatasIni.libelle"
      :titre="lesDatasIni.titre"
      :famillestypes="lesDatasIni.famillestypes"
      :familletitre="lesDatasIni.familletitre"
      :nomfichiertitre="lesDatasIni.nomfichiertitre"
      :sujet="lesDatasIni.sujet"
      :auteuremploye="lesDatasIni.auteuremploye"
      :auteursacteur="lesDatasIni.auteursacteur"
      :objetslies="lesDatasIni.objetslies"
      :idniveauconfidentialite="lesDatasIni.idniveauconfidentialite"
      :sizemax="lesDatasIni.sizemax"
      :suitesauve="suiteSauveDP"
      @postDocument="receptionDocumentPost"
  ></DocumentPost>
  </Suspense>
  
  <v-btn
    v-if="suitesauve == 'emitdocsinit' || suitesauve == 'emitdocskeep'"
    class="floating-btn"
    color="primary"
    fab
    fixed
    bottom
    right
    @click="emitdocs()"
  >
    Indexation terminée
  </v-btn> 

</template>

<script setup>
import { ref, toRefs, watch } from 'vue'
import { documentPostPropsIni } from '@/configurationini.js'

const emit = defineEmits(['postDocument'])
const postDocument = (jsonDocument) => {
    emit('postDocument', jsonDocument)
}

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
    suitesauve: {
      type: String,
      default() {
        return 'pagedata'
      }
    },
})
const { codeConfigIni } = toRefs(props)
const { jsonConfigIni } = toRefs(props)
const { suitesauve } = toRefs(props)

const determineSuiteSauveDP = (suitesauve) => {
  let suiteSauveDP = 'init'
  if (suitesauve == 'pagedata' || suitesauve == 'pageedit' || suitesauve == 'emitinit' || suitesauve == 'emitdocsinit') {
    suiteSauveDP == 'init' 
  } else if (suitesauve == 'keep' || suitesauve == 'emitkeep' || suitesauve == 'emitdocskeep') {
    suiteSauveDP = 'keep'
  } else {
    suiteSauveDP = 'init' 
  }
  //console.log(`suitesauve initial: ${suitesauve} // suitesauve docpost: ${suiteSauveDP}`)  
  return suiteSauveDP 
}

const suiteSauveDP = ref('init')
suiteSauveDP.value = determineSuiteSauveDP(suitesauve.value)
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
    familletitre: 'non',
    nomfichiertitre: 'non',
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
if (propsIni.hasOwnProperty("familletitre")) {
    lesDatasIni.value.familletitre = propsIni.familletitre
}
if (propsIni.hasOwnProperty("nomfichiertitre")) {
    lesDatasIni.value.nomfichiertitre = propsIni.nomfichiertitre
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

watch(() => props.suitesauve, (newVal, oldVal) => {
  suiteSauveDP.value = determineSuiteSauveDP(newVal)
})

const docsResponseData = []
const receptionDocumentPost = (responseData) => {
  console.log(`receptionDocumentPost suite emit ${JSON.stringify(responseData)}`)
  //const oDocument = JSON.parse(jsonData)
  const success = responseData.success
  if (success) {
    const idDocument = responseData.iddocument
    switch (suitesauve.value) {
      case "pagedata":
        document.location.href = "/goeland/document/document_data.php?iddocument="+idDocument
        break      
      case "pageedit":
        document.location.href = "/goeland/document/document_edition_cligli.php?iddocument="+idDocument
        break
      case "emitinit":
      case "emitkeep":
      const rReponseData = { 
          success: responseData.success,
          documents: [{
            iddocument: responseData.iddocument,
            titre: responseData.titre,
            taille: responseData.taille,
            md5: responseData.md5,
            message: responseData.message,
          }]
        }
        emit('postDocument', rReponseData)
        break
      case "emitdocsinit":
      case "emitdocskeep":
        const docReponseData = {
          iddocument: responseData.iddocument,
          titre: responseData.titre,
          taille: responseData.taille,
          md5: responseData.md5,
          message: responseData.message,
        }
        docsResponseData.push(docReponseData)
        break      
    }
  } else {
    bSnackbar.value = true
    message.value = responseData.message
    emit('postDocument', responseData) 
  }
}

const emitdocs = () => {
  emit('postDocument', {
      success: true,
      documents: docsResponseData
    }
  )
}
</script>