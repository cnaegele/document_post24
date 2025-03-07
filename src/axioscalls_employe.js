import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurlemploye = '/goeland/employe/axios/'

export async function employeInfoParId(idEmploye) {
    const urlei = `${g_devurl}${g_pathurlemploye}employe_information_parid.php`
    const params = new URLSearchParams([['idemploye', idEmploye]])
    const response = await axios.get(urlei, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
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

function traiteAxiosError(error) {
    if (error.response) {
        return `${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
    } else if (error.request.responseText) {
        return error.request.responseText
    } else {
        return error.message
    }
}