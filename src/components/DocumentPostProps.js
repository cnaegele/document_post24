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
        ]
      }
    },
    sujet: {
      type: String,
      default() {
        return ''
      } 
    },
    objetslies: {
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
          ],
      
      sujet: '',
      sizemax: 10000000,  
  }