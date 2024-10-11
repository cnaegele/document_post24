import { ref } from 'vue'
import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}

export async function getDataUserInfo(groupeSecurite, user) {
    const urlui = `${g_devurl}/goeland/gestion_spec/g_login_f5.php`
    const params = new URLSearchParams([['groupesecurite', groupeSecurite]])
    const response = await axios.get(urlui, { params })
    const userInfo = response.data
    user.idEmployeUser = ref(userInfo.id_employe)
    user.nomEmployeUser = ref(userInfo.nom_employe)
    user.prenomEmployeUser = ref(userInfo.prenom_employe)
    user.loginEmployeUser = ref(userInfo.login_employe)
    user.groupeSecurite = ref(userInfo.groupesecurite)
    user.bInGroupe = ref(userInfo.bingroupe)
}
