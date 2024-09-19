<template>
  <v-app>
    <v-main>
      <AppToper />
      <Suspense>
        <DocumentPost
          :sizemax="5000000"
          titre=""
          sujet=""
          @postDocument="receptionDocumentPost"
        ></DocumentPost>
    </Suspense>
    </v-main>
  </v-app>
</template>

<script setup>
const receptionDocumentPost = (jsonData) => {
  console.log(`receptionDocumentPost suite emit ${jsonData}`)
  const oDocument = JSON.parse(jsonData)
  const idDocument = oDocument.iddocument
  document.location.href = "https://mygolux.lausanne.ch/goeland/document/document_data.php?iddocument="+idDocument 
}
</script>
