import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurldocument = '/goeland/document/axios/'

export async function getConfigurationInitiale(codeConfig) {
    const urlcoi = `${g_devurl}${g_pathurldocument}document_nouveau_configuration.php`
    const params = new URLSearchParams([['codeconfig', codeConfig]])
    const response = await axios.get(urlcoi, { params })
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

export async function documentListeParSHA256(strSHA256) {
    const urldls = `${g_devurl}${g_pathurldocument}document_liste_parsha256.php`
    const params = new URLSearchParams([['sha256', strSHA256]])
    const response = await axios.get(urldls, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function documentInfoParId(idDocument) {
    const urldii = `${g_devurl}${g_pathurldocument}document_info_parid.php`
    const params = new URLSearchParams([['iddocument', idDocument]])
    const response = await axios.get(urldii, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function uploadFile(formData) {
    const urlpodo = `${g_devurl}${g_pathurldocument}document_post.php`
    console.log(`in [async function uploadFile(formData)] url: ${urlpodo}`)
    //let response
    try {
            console.log('in try axios.post(...)')
            let response = await axios.post(urlpodo, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })        
            if (response.status == 200) {
                console.log(`in try axios.post(...) response.status == 200. response.data: ${JSON.stringify(response.data)}`)
                return(response.data)
            } else {
                console.log('in try axios.post(...) ERREUR: response.status != 200')
                const respData = {
                    "success": false,
                    "titre": '',
                    "iddocument": 0,
                    "message": `response.status: ${response.status}`,
                }
                return(respData)
            }
    } catch (error) {
        console.log('in catch axios.post(...) ERREUR')
        const messageErreur = traiteAxiosError(error)
        const respData = {
            "success": false,
            "titre": '',
            "iddocument": 0,
            "message": messageErreur,
        }
        return(respData)
    }        
}

function traiteAxiosError(error) {
    if (error.response) {
        return `error.response:<br>${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
    } else if (error.request.responseText) {
        return `error.request:<br>${error.request.responseText}`
    } else {
        return `error.message:<br>${error.message}`
    }
}