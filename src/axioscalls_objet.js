import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}
const g_pathurlobjet = '/goeland/objet/axios/'
const g_pathurlparcelle = '/goeland/parcelle/axios/'
const g_pathurlbatiment = '/goeland/batiment/axios/'

export async function objetInfoParId(idObjet) {
    const urloi = `${g_devurl}${g_pathurlobjet}objet_information_parid.php`
    const params = new URLSearchParams([['idobjet', idObjet]])
    const response = await axios.get(urloi, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function batimentListe(jsonCriteres) {
    /**
     * jsonCritere :
     * crtype : type de critère. nom: recherche par nom  eca: recherche par n° ECA  egid: recherche par egid
     * critere
     * nombremaximumretour : nombre maximun de bâtiments retournés
     */
    const urlbal = `${g_devurl}${g_pathurlbatiment}batiment_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    const response = await axios.get(urlbal, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function batimentListeParAdresse(jsonCriteres) {
    /**
     * jsonCritere :
     * idadresse : identifian de l'adresse
     * baannexe (optionnel def 1) : 1 retourne les éventuels bâtiments annexes / 0 uniquement le bâtiment avec l'adresse
     */
    const urlbaa = `${g_devurl}${g_pathurlbatiment}batiment_liste_paradresse.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    const response = await axios.get(urlbaa, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function parcelleListeParAdresse(jsonCriteres) {
    /**
     * jsonCritere :
     * idadresse : identifian de l'adresse
     * bactif (optionnel def 1) : 1 uniquement parcelles "active" / 0 avec parcelle inactive (radiée)
     * bstandard (optionnel def 1) : 1 retour parcelles standard / 0 pas de parcelle standard
     * bddp (optionnel def 1) : 1 retour parcelles DDP / 0 pas de DDP
     * bppe (optionnel def 1) : 1 retour des parcelles PPE / 0 pas de PPE
     * bcopr (optionnel def 1) : 1 retour des parcelles Copropriété / 0 pas de Copropriété
     */
    const urlpla = `${g_devurl}${g_pathurlparcelle}parcelle_liste_paradresse.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    const response = await axios.get(urlpla, { params })
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