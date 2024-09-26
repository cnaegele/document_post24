import { getConfigurationInitiale } from './axioscalls.js'
import { documentPostPropsDefault } from './components/DocumentPostProps.js'

//On va chercher une configuration initiale par défaut dans le javascript qui défini aussi 
//les propriétés par défaut du composant DocumentPost
export const documentPostPropsIni = async (codeconfig = '') => {
  if (codeconfig == '') {
    return documentPostPropsDefault
  } else {
    const configInitiale = await getConfigurationInitiale(codeconfig)
    if (JSON.stringify(configInitiale) != '{}') {
      return configInitiale
    } else {
      return documentPostPropsDefault  
    }
  }
}