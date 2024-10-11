import { ref } from 'vue'
import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurldocument = '/goeland/document/axios/'
const g_pathurlobjet = '/goeland/objet/axios/'
const g_pathurlemploye = '/goeland/employe/axios/'
const g_pathurlacteur = '/goeland/acteur/ajax/'
const g_pathurluniteorg = '/goeland/uniteorg/axios/'
const g_pathurlgroupesecurite = '/goeland/gestion_spec/securitegroupe/axios/'

export async function getConfigurationInitiale(codeConfig) {
    const urlcoi = `${g_devurl}${g_pathurldocument}document_nouveau_configuration.php`
    const params = new URLSearchParams([['codeconfig', codeConfig]])
    const response = await axios.get(urlcoi, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function getGroupesSecuriteListe(jsonCriteres = '{}') {
    const urlgsl = `${g_devurl}${g_pathurlgroupesecurite}securitegroupe_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urlgsl, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })    
    return response.data
}

export async function getDicoNiveauConfidentialite() {
    const urldnc = `${g_devurl}${g_pathurldocument}document_niveauconfidentialite_dico.php`
    const response = await axios.get(urldnc)
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function documentListeParMD5(strMD5) {
    const urldlm = `${g_devurl}${g_pathurldocument}document_liste_parmd5.php`
    const params = new URLSearchParams([['md5', strMD5]])
    const response = await axios.get(urldlm, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function employeInfoParId(idEmploye) {
    const urlei = `${g_devurl}${g_pathurlemploye}employe_information_parid.php`
    const params = new URLSearchParams([['idemploye', idEmploye]])
    const response = await axios.get(urlei, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function getDataUserInfo(groupeSecurite) {
    const params = new URLSearchParams([['groupesecurite', groupeSecurite]])
    const urlui = `${g_devurl}/goeland/gestion_spec/g_login_f5.php`
    const response = await axios.get(urlui, { params })
        .catch(function (error) {
            traiteAxiosError(error, lesData)
        })   
    return response.data
}

export async function getEmployesListe(jsonCriteres) {
    const urlel = `${g_devurl}${g_pathurlemploye}employe_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urlel, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function acteurInfoParId(idActeur) {
    const urlad = `${g_devurl}${g_pathurlacteur}acteur_data.php`
    const params = new URLSearchParams([['idacteur', idActeur]])
    const response = await axios.get(urlad, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function getActeurData(idActeur) {
    const urlad = `${g_devurl}${g_pathurlacteur}acteur_data.php`
    const params = new URLSearchParams([['idacteur', idActeur]])
    const response = await axios.get(urlad, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}
export async function getActeurDataAdresse(idActeur) {
    const urlada = `${g_devurl}${g_pathurlacteur}acteur_dataadresse.php`
    const params = new URLSearchParams([['idacteur', idActeur]])
    const response = await axios.get(urlada, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}
export async function getActeurDataComplement(idActeur) {
    const urladc = `${g_devurl}${g_pathurlacteur}acteur_datacomplement.php`
    const params = new URLSearchParams([['idacteur', idActeur]])
    const response = await axios.get(urladc, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}
export async function getActeurDataActeurLie(idActeur) {
    const urladal = `${g_devurl}${g_pathurlacteur}acteur_dataacteurlie.php`
    const params = new URLSearchParams([['idacteur', idActeur]])
    const response = await axios.get(urladal, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}
export async function getActeurDataRole(idActeur, idemploye) {
    if (idemploye === undefined || idemploye === null) {
        idemploye = 0
    }
    const urladr = `${g_devurl}${g_pathurlacteur}acteur_datarole.php`
    const params = new URLSearchParams([['idacteur', idActeur], ['idemploye', idemploye]])
    const response = await axios.get(urladr, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}
export async function getActeursListe(jsonCriteres) {
    const urlal = `${g_devurl}${g_pathurlacteur}acteur_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urlal, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function objetInfoParId(idObjet) {
    const urloi = `${g_devurl}${g_pathurlobjet}objet_information_parid.php`
    const params = new URLSearchParams([['idobjet', idObjet]])
    const response = await axios.get(urloi, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function getUnitesOrgListe(jsonCriteres = '{}') {
    const urluol = `${g_devurl}${g_pathurluniteorg}uniteorg_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urluol, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })    
    return response.data
}

export async function uploadFile(formData) {
    const urlpodo = `${g_devurl}${g_pathurldocument}document_post.php`
    try {
        const response = await axios.post(urlpodo, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        // Ajoutez ici le code pour gérer la réponse du serveur
        //console.log('dans uploadFile Fichier téléchargé avec succès:', response.data)
        return(response.data)
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier:', error)
        // Ajoutez ici le code pour gérer les erreurs
        return('')
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