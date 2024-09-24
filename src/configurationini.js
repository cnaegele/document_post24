
export const documentPostPropsIni = async (codeconfig = '') => {
  if (codeconfig == '') {
    return {
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
    xsujet: 'sujet de la configuration initiale',
    sizemax: 10000000,
      }
    }
  }