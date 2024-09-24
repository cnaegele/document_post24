
export const documentPostPropsIni = async (codeconfig = '') => {
  const defaultConfig = {
    famillestypes: [
            {
            id: 7,
            label: 'Correspondance',
            value: '7',
            type: [
              {
                  id: 15,
                  label: 'pdf',
                  value: '15',
              },
              {
                  id: 18,
                  label: 'txt',
                  value: '18',
              },
            ],
          },
          {
            id: 5,
            label: 'Photo',
            value: '5',
            type: [
              {
                  id: 15,
                  label: 'pdf',
                  value: '15',
              },
              {
                  id: 5,
                  label: 'jpg',
                  value: '5',
              },
              {
                  id: 20,
                  label: 'png',
                  value: '20',
              },
            ],
          },
        ],
    
    titre: 'titre de la configuration initiale',
    sujet: 'sujet de la configuration initiale',
    sizemax: 10000000,
  }

  if (codeconfig == '') {
    return defaultConfig
  } else {
    //Ici il faudra faire l'appel axios qui va lire le fichier de config correspondant au paramètre codeconfig
    return defaultConfig  
  }
}