//plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import { storevtfytheme } from '@/cnlibrary/stores/vtfytheme.js'
import { getTheme } from '@/cnlibrary/vgotheme.js' 

const goelandTheme = getTheme('goeland')

export default {
  install: (app) => {
    const vtfytheme = storevtfytheme()
    const vuetify = createVuetify({
      directives,
      theme: {
        defaultTheme: vtfytheme.themeChoisi,
        themes: {
          goelandTheme,
        },
      },
    })

    app.use(vuetify)
  }
}

