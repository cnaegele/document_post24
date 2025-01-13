/**
 * @prop {string} libelle - Libelle s'affichant en haut de la page
 * @default ''
 * @example  
 * Indexation document depuis une affaire OPC-Demande de PC 
 * 
 * 
 * 
 * 
 * 
 */
export const documentPostProps = {
  libelle: {
    type: String,
    default() {
      return ''
    }     
  },
  titre: {
    type: String,
    default() {
      return ''
    } 
  },
  famillestypes: {
      type: Array,
      default() {
        return [
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
          {
            id: 11,
            label: 'Plan',
            value: '11',
            type: [
              {
                  id: 15,
                  label: 'pdf',
                  value: '15',
              },
            ],
          },
          {
            id: 18,
            label: 'Procès verbal, notes de séance',
            value: '18',
            type: [
              {
                id: 15,
                label: 'pdf',
                value: '15',
              },
              {
                id: 21,
                label: 'docx',
                value: '21',
              },
              {
                id: 27,
                label: 'odt',
                value: '27',
              },
              {
                id: 18,
                label: 'txt',
                value: '18',
              },
            ],
          },
        ]
      }
    },
    familletitre: {
      type: String,
      default() {
        return 'non'
      } 
    },
    nomfichiertitre: {
      type: String,
      default() {
        return 'non'
      } 
    },
    sujet: {
      type: String,
      default() {
        return ''
      } 
    },
    auteuremploye: {
      type: String,
      default() {
        return ''
      }
    },
    auteursacteur: {
      type: Array,
      default() {
        return []
      }
    },
    objetslies: {
      type: Array,
      default() {
        return []
      }
    },
    documentsliesedit: {
      type: String,
      default() {
        return 'oui'
      }
    },
    documentslies: {
      type: Array,
      default() {
        return []
      }
    },
    affaireslieesedit: {
      type: String,
      default() {
        return 'non'
      }
    },
    affairesliees: {
      type: Array,
      default() {
        return []
      }
    },
    idniveauconfidentialite: {
      type: String,
      default() {
        return '1'
      }
    },
    sizemax: {
      type: Number,
      default() {
        return 10000000
      }
    },
    suitesauve: {
      type: String,
      default() {
        return 'init'
      }
    }
  }

  export const documentPostPropsDefault = {
    libelle: '',
    titre: '',
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
            {
              id: 11,
              label: 'Plan',
              value: '11',
              type: [
                {
                    id: 15,
                    label: 'pdf',
                    value: '15',
                },
              ],
            },
            {
              id: 18,
              label: 'Procès verbal, notes de séance',
              value: '18',
              type: [
                {
                  id: 15,
                  label: 'pdf',
                  value: '15',
                },
                {
                  id: 21,
                  label: 'docx',
                  value: '21',
                },
                {
                  id: 27,
                  label: 'odt',
                  value: '27',
                },
                {
                  id: 18,
                  label: 'txt',
                  value: '18',
                },
              ],
            },
          ],
      familletitre: 'apres',
      nomfichiertitre: '',
      sujet: '',
      sizemax: 10000000,  
  }