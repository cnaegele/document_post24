export const documentPostProps = {
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
    sizemax: {
      type: Number,
      default() {
        return 6000000
      }
    }
  }