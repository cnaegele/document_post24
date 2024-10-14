import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
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

function traiteAxiosError(error) {
    if (error.response) {
        return `${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
    } else if (error.request.responseText) {
        return error.request.responseText
    } else {
        return error.message
    }
}