<template>
    <div style="position: absolute; right: 16px;">
        <Suspense><UserInformation groupeSecurite="AffaireManager"></UserInformation></Suspense>
    </div>
    
    <div>
    Goéland. Document indexation
    <br><br>
    <v-file-input
      v-model="file"
      show-size
      label="Sélectionnez un fichier"
    ></v-file-input>
    <v-btn @click="uploadFile" :disabled="!file">
      Télécharger
    </v-btn>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const file = ref(null)
  const title = ref('')
  const description = ref('')
  
  const uploadFile = async () => {
    console.log(file.value)
    if (!file.value) return
  
    const formData = new FormData()
    formData.append('file', file.value)

    // Création de l'objet JSON avec les données attributaires
    title.value = 'titre du document'
    description.value = 'description du document'
    const metadata = {
        title: title.value,
        description: description.value,
    // .....
    }

    // Ajout des métadonnées JSON au FormData
    formData.append('metadata', JSON.stringify(metadata))
  
    
    try {
      const response = await axios.post('https://mygolux.lausanne.ch/goeland/document/axios/document_post.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Fichier téléchargé avec succès:', response.data)
      // Ajoutez ici le code pour gérer la réponse du serveur
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
      // Ajoutez ici le code pour gérer les erreurs
    }
  }
  </script>