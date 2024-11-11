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
/**
 * Composant DPDataInitialLoad permet de passer des propriétes au composant DocumentPost
 */
import { ref, toRefs, watch } from 'vue'
import { dpDataInitialLoadProps } from '@/components/DPDataInitialLoadProps.js'
import { documentPostPropsIni } from '@/configurationini.js'

const emit = defineEmits(['postDocument'])
const postDocument = (jsonDocument) => {
    emit('postDocument', jsonDocument)
}

/**
 * @props - définies dans DPDataInitialLoadProps.js
 */
const props = defineProps(dpDataInitialLoadProps)
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
console.log(jsonConfigIni.value)
if (jsonConfigIni.value !== '') {
  configIni = JSON.parse(jsonConfigIni.value)
  console.log(configIni)  
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
}
//console.log(lesDatasIni.value)

//Modification de la propriété suitesauve, il faut adapter la propriété suitesauve de DocumentPost
watch(() => props.suitesauve, (newVal, oldVal) => {
  suiteSauveDP.value = determineSuiteSauveDP(newVal)
})

const docsResponseData = []
/**
 * Traitement selon la valeur de la propriété suitesauve de l'évènement postDocument emit par documentPost
 * @param responseData 
 * objet retourné par documentPost::postDocument
 * {
 *    success
 *    document [{
 *      iddocument
 *      titre
 *      dateofficielle
 *      taille
 *      md5
 *      message }]
 * }
 * suitesauve : pagedata - Ouvre la page goéland de consultation des métdonnées du document
 * suitesauve : pageedit - Ouvre la page goéland d'édition des métdonnées du document
 * suitesauve : keep - Conserve les données saisies sauf le fichier à poster
 * suitesauve : emitinit - Emet l'évènement postDocument, réinitialise les données selon la configuration initiale
 * suitesauve : emitkeep - Emet l'évènement postDocument, conserve les données saisies sauf le fichier à poster
 * suitesauve : emitdocsinit - Stoque informations dans l'objet qui sera emis au clic sur [Indexation terminée], réinitialise les données selon la configuration initiale
 * suitesauve : emitdocskeep - Stoque informations dans l'objet qui sera emis au clic sur [Indexation terminée], conserve les données saisies sauf le fichier à poster
 */
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
            dateofficielle: responseData.dateofficielle,
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
          dateofficielle: responseData.dateofficielle,
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

/**
 * @event DPDataInitialLoad#postDocument
 * @type {object}
 * @property {boolean} success
 * @property {objects array} documents
 */ 
const emitdocs = () => {
  emit('postDocument', {
      success: true,
      documents: docsResponseData
    }
  )
}
</script>