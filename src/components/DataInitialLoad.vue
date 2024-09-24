<template>
    <DocumentPost
        :sizemax="5000000"
        :titre="lesDatasIni.titre"
        :sujet="lesDatasIni.sujet"
        :famillestypes="lesDatasIni.famillestypes"
        @postDocument="receptionDocumentPost"
    ></DocumentPost>
</template>
<script setup>
import { ref, toRefs, watch } from 'vue'
import { documentPostPropsIni } from '../configurationini.js'
import { dataini } from '@/stores/dataini.js'
const lesDatasIni = dataini()
const propsIni =  await documentPostPropsIni('')

    if (propsIni.hasOwnProperty("titre")) {
        lesDatasIni.titre = propsIni.titre
    }
    if (propsIni.hasOwnProperty("sujet")) {
        lesDatasIni.sujet = propsIni.sujet
    }

    lesDatasIni.famillestypes = ref(
  [
            {
            id: 7,
            label: 'Correspondance du ventre',
            value: '7',
            type: [
            {
                  id: 15,
                  label: 'pdf',
                  value: '15',
              },
              {
                  id: 18,
                  label: 'txt',
                  value: '18',
              },
            ],
          },
          {
            id: 5,
            label: 'Photo',
            value: '5',
            type: [
            {
                  id: 15,
                  label: 'pdf',
                  value: '15',
              },
              {
                  id: 5,
                  label: 'jpg',
                  value: '5',
              },
              {
                  id: 20,
                  label: 'png',
                  value: '20',
              },
            ],
          },
        ]
)
//Fin proprietés

const receptionDocumentPost = (jsonData) => {
  console.log(`receptionDocumentPost suite emit ${jsonData}`)
  const oDocument = JSON.parse(jsonData)
  const idDocument = oDocument.iddocument
  document.location.href = "https://mygolux.lausanne.ch/goeland/document/document_data.php?iddocument="+idDocument 
}
</script>