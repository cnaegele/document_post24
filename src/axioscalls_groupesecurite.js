import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurlgroupesecurite = '/goeland/gestion_spec/securitegroupe/axios/'

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

function traiteAxiosError(error) {
    if (error.response) {
        return `${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
    } else if (error.request.responseText) {
        return error.request.responseText
    } else {
        return error.message
    }
}