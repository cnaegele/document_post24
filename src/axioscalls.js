import { ref } from 'vue'
import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurl = '/goeland/document/axios/'

export async function getDicoNiveauConfidentialite() {
    const urldnc = `${g_devurl}${g_pathurl}document_niveauconfidentialite_dico.php`
    const response = await axios.get(urldnc)
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function documentListeParMD5(strMD5) {
    const urldlm = `${g_devurl}${g_pathurl}document_liste_parmd5.php`
    const params = new URLSearchParams([['md5', strMD5]])
    const response = await axios.get(urldlm, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function uploadFile(formData) {
    const urlpodo = `${g_devurl}${g_pathurl}document_post.php`
    try {
        const response = await axios.post(urlpodo, formData, {
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

function traiteAxiosError(error) {
    if (error.response) {
        return `${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
    } else if (error.request.responseText) {
        return error.request.responseText
    } else {
        return error.message
    }
}