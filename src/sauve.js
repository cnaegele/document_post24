import { storedatadoc } from './stores/data.js'
import { MD5, lib } from 'crypto-js'
import { documentListeParMD5, uploadFile } from './axioscalls.js'

export const verifieNouveauMD5 = async () => {
    const lesDatas = storedatadoc()
    let strMD5 = ''

    if (!lesDatas.file) {
        return true
    } 

    //Lecture du contenu pour calcul md5
    const fileContents = await readFileAsArrayBuffer(lesDatas.file)
    const wordArray =  lib.WordArray.create(fileContents)
    strMD5 = MD5(wordArray).toString()
    //console.log(`md5: ${strMD5}`)    
    const docListe = await documentListeParMD5(strMD5)
    if (docListe.length > 0) {
        lesDatas.messagesErreur.timeOutSnackbar = 60000
        lesDatas.messagesErreur.bSnackbar = true
        lesDatas.messagesErreur.messageSnackbar = `<b>Ce document existe déjà sur goéland</b><br><b>Id:</b> ${docListe[0].iddoc}<br><b>Titre:</b> ${docListe[0].titredoc}<br><i>indexé le ${docListe[0].dateindexation} par ${docListe[0].empcreateur} / ${docListe[0].uniteorgcreateur}</i>`
        lesDatas.controle.bDataFileOK = false
        return false
    } else {
        lesDatas.controle.bDataFileOK = true
        return true
    }
}

export const demandeSauveData = async () => {
    const lesDatas = storedatadoc()
    let strMD5 = ''

    //Upload
    if (!lesDatas.file) {
        return
    }

    //On reverifie au cas où un utilisateur plus rapide a indexé le fichier après sa selection
    const bNouveauMD5 = await verifieNouveauMD5()
    if (!bNouveauMD5) {
        return
    }

    const formData = new FormData()
    formData.append('file', lesDatas.file)

    const aIdActeurAuteur = []
    if (lesDatas.document.acteurAuteur.length > 0) {
        for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
            aIdActeurAuteur.push(lesDatas.document.acteurAuteur[i].id)   
        }
    }

    const aIdObjetsLies = []
    if (lesDatas.document.objetsLies.length > 0) {
        for (let i=0; i<lesDatas.document.objetsLies.length; i++) {
            aIdObjetsLies.push(lesDatas.document.objetsLies[i].id)   
        }
    }

    const aIdEmployesDroitConsultation = []
    const aIdUnitesOrgDroitConsultation = []
    const aIdGroupesSecuriteDroitConsultation = []
    if (lesDatas.document.idNiveauConfidentialite != '0' && lesDatas.document.idNiveauConfidentialite != '1') {
        if (lesDatas.document.employesDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.employesDroitConsultation.length; i++) {
                aIdEmployesDroitConsultation.push(lesDatas.document.employesDroitConsultation[i].id)   
            }
        }
        if (lesDatas.document.unitesOrgDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.unitesOrgDroitConsultation.length; i++) {
                aIdUnitesOrgDroitConsultation.push(lesDatas.document.unitesOrgDroitConsultation[i].id)   
            }
        }
        if (lesDatas.document.groupesSecuriteDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.groupesSecuriteDroitConsultation.length; i++) {
                aIdGroupesSecuriteDroitConsultation.push(lesDatas.document.groupesSecuriteDroitConsultation[i].id)   
            }
        }
    }

    // Création de l'objet JSON avec les données attributaires
    const metadata = {
        titre: lesDatas.document.titre,
        idfamille: lesDatas.document.idFamille,
        idtype: lesDatas.document.idType,
        sujet: lesDatas.document.sujet,
        description: lesDatas.document.description,
        commentaire: lesDatas.document.commentaire,
        dateofficielle: lesDatas.document.dateOfficielle,
        documentintext: lesDatas.document.documentIntExt,
        idemployeauteur: lesDatas.document.idEmployeAuteur,
        idniveauconfidentialite: lesDatas.document.idNiveauConfidentialite,
        idacteurauteur: aIdActeurAuteur,
        idobjetslies: aIdObjetsLies,
        idEmployesDroitConsultation: aIdEmployesDroitConsultation,
        idUnitesOrgDroitConsultation: aIdUnitesOrgDroitConsultation,
        idGroupesSecuriteDroitConsultation: aIdGroupesSecuriteDroitConsultation,
    }

    // Ajout des métadonnées JSON au FormData
    console.log(metadata)
    formData.append('metadata', JSON.stringify(metadata))
   
    const reponseData = await uploadFile(formData)
    return(reponseData)
}

async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  }
