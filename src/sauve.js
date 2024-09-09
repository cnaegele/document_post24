import axios from 'axios'
import { data } from '@/stores/data.js'
import { documentListeParMD5, uploadFile } from '@/axioscalls.js'

export const demandeSauveData = async () => {
    const lesDatas = data()
    let strMD5 = ''

    //Upload
    console.log(lesDatas.file)
    if (!lesDatas.file) return

    //Lecture du contenu pour calcul md5
    const fileContents = await readFileAsArrayBuffer(lesDatas.file)
    const wordArray = CryptoJS.lib.WordArray.create(fileContents)
    strMD5 = CryptoJS.MD5(wordArray).toString()
    console.log(`md5: ${strMD5}`)    
    const docListe = await documentListeParMD5(strMD5)
    if (docListe.length > 0) {
        lesDatas.messagesErreur.timeOutSnackbar = 60000
        lesDatas.messagesErreur.bSnackbar = true
        lesDatas.messagesErreur.messageSnackbar = `<b>Ce document existe déjà sur goéland</b><br><b>Id:</b> ${docListe[0].iddoc}<br><b>Titre:</b> ${docListe[0].titredoc}<br><i>indexé le ${docListe[0].dateindexation} par ${docListe[0].empcreateur} / ${docListe[0].uniteorgcreateur}</i>`
        return
    }

    const formData = new FormData()
    formData.append('file', lesDatas.file)

    // Création de l'objet JSON avec les données attributaires
    const metadata = {
        titre: lesDatas.document.titre,
        description: lesDatas.document.description,
    // .....
    }

    // Ajout des métadonnées JSON au FormData
    formData.append('metadata', JSON.stringify(metadata))
    
    uploadFile(formData)
    /*
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
    */    
    /*
    if (lesDatas.controle.dataGenChange && provenance == 'general') {
        if (lesDatas.bdataGenOK) {
            lesDatas.affaire.gen.nom = lesDatas.affaire.gen.nom.trim()
            lesDatas.affaire.gen.description = lesDatas.affaire.gen.description.trim()
            lesDatas.affaire.gen.commentaire = lesDatas.affaire.gen.commentaire.trim()
            await sauveDataGen(lesDatas)
            lesDatas.controle.dataGenChange = false
        } else {
            alert("Il faut corriger les données invalides avant de pouvoir sauver !")
        }
    }
    
    if (lesDatas.controle.dataEmployeConcChange && (provenance == 'general' || provenance == 'employe')) {
        await sauveEmployeConcerne(lesDatas)
        lesDatas.controle.dataEmployeConcChange = false
    }

    if (lesDatas.controle.dataUniteOrgConcChange && (provenance == 'general' || provenance == 'uniteorg')) {
        await sauveUniteOrgConcerne(lesDatas)
        lesDatas.controle.dataUniteOrgConcChange = false
    }
    
    if (lesDatas.controle.dataActeurConcChange && (provenance == 'general' || provenance == 'acteur')) {
        await sauveActeurConcerne(lesDatas)
        lesDatas.controle.dataActeurConcChange = false
    }
    
    let nbrCtrl2Change = 0
    for (const [key, value] of Object.entries(lesDatas.controle)) {
        if ( key.indexOf('Change') > 1 &&  value === true) {
            nbrCtrl2Change++    
        }
    }
    if (nbrCtrl2Change == 1) {
        //rien d'autre à sauver
        lesDatas.controle.dataChange = false
    }
    */
}

async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  }
