import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurlaffaire = '/goeland/affaire2/axios/'

export async function affaireInfoParId(idAffaire) {
    const urlai = `${g_devurl}${g_pathurlaffaire}affaire_info_parid.php`
    const params = new URLSearchParams([['idaffaire', idAffaire]])
    const response = await axios.get(urlai, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
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