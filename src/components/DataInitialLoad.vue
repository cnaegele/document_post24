<template>
    <DocumentPost
        :sizemax="lesDatasIni.sizemax"
        :titre="lesDatasIni.titre"
        :sujet="lesDatasIni.sujet"
        :famillestypes="lesDatasIni.famillestypes"
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
console.log(codeConfigIni.value)

const lesDatasIni = ref(
  {
        famillestypes: [],
        titre:  '',
        sujet:  '',
        sizemax: 10000000,
  }
)

const propsIni =  await documentPostPropsIni(codeConfigIni.value)
//console.log(`propsini: ${propsIni}`)
if (propsIni.hasOwnProperty("famillestypes")) {
    lesDatasIni.value.famillestypes = propsIni.famillestypes
}
if (propsIni.hasOwnProperty("titre")) {
    lesDatasIni.value.titre = propsIni.titre
}
if (propsIni.hasOwnProperty("sujet")) {
    lesDatasIni.value.sujet = propsIni.sujet
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