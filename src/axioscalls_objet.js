import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurlobjet = '/goeland/objet/axios/'

export async function objetInfoParId(idObjet) {
    const urloi = `${g_devurl}${g_pathurlobjet}objet_information_parid.php`
    const params = new URLSearchParams([['idobjet', idObjet]])
    const response = await axios.get(urloi, { params })
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