<template>
    <DocumentPost
        :libelle="lesDatasIni.libelle"
        :titre="lesDatasIni.titre"
        :famillestypes="lesDatasIni.famillestypes"
        :sujet="lesDatasIni.sujet"
        :idniveauconfidentialite="lesDatasIni.idniveauconfidentialite"
        :sizemax="lesDatasIni.sizemax"
        @postDocument="receptionDocumentPost"
    ></DocumentPost>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { documentPostPropsIni } from '../configurationini.js'
const props = defineProps({
  codeConfigIni: {
      type: String,
      default() {
        return ''
      } 
    }
})
const { codeConfigIni } = toRefs(props)
//console.log(codeConfigIni.value)

const lesDatasIni = ref(
  {
    libelle: '',
    titre:  '',
    famillestypes: [],
    sujet:  '',
    idniveauconfidentialite: '1',
    sizemax: 10000000,
  }
)

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

const receptionDocumentPost = (jsonData) => {
  console.log(`receptionDocumentPost suite emit ${jsonData}`)
  const oDocument = JSON.parse(jsonData)
  const succes = oDocument.succes
  if (succes) {
    const idDocument = oDocument.iddocument
    document.location.href = "https://mygolux.lausanne.ch/goeland/document/document_data.php?iddocument="+idDocument
  } else {
    alert(oDocument.message)  
  }
}
</script>