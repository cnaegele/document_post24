<template>
<v-row no-gutters class="d-flex align-center">
    <v-col cols="auto">
    Utilisateur : {{ user.prenomEmployeUser }} {{ user.nomEmployeUser }} / {{ user.loginEmployeUser }}
    </v-col>
    <v-col cols="auto">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</v-col>
    <v-col cols="auto">thème :&nbsp;</v-col>
    <v-col cols="auto">
    <v-select
        class="d-flex align-center"
        :items="['foncé', 'clair', 'goéland']"
        density="compact"
        height="20px"
        max-width="200px"
        v-model="themeAffiche"
        @update:model-value="choixTheme" 
    ></v-select>
    </v-col>
</v-row>
</template>
<script setup>
    import { ref } from 'vue'
    import { storevtfytheme } from '@/cnlib/stores/vtfytheme.js'
    import { storeuser } from '../stores/user.js'
    import { getDataUserInfo } from  '@/cnlib/cnlib_axioscalls.js'
    import { useTheme } from 'vuetify'
    
    const props = defineProps({
        groupeSecurite: {
            type: String,
            required: false
        }
    })
    const vtfytheme = storevtfytheme()
    const user = storeuser()
    getDataUserInfo(props.groupeSecurite, user)
    let themeAffiche
    if (vtfytheme.themeChoisi == 'dark') {
        themeAffiche = ref('foncé')    
    } else if (vtfytheme.themeChoisi == 'light') {
        themeAffiche = ref('clair')   
    } else if (vtfytheme.themeChoisi == 'goelandTheme') {
        themeAffiche = ref('goéland')   
    } else {
        themeAffiche = ref('foncé')   
    }
    const theme = useTheme()

    function choixTheme(value) {
        if (value == 'foncé') {
            vtfytheme.themeChoisi = 'dark'
            theme.global.name.value = 'dark'
            localStorage.setItem('themeChoisi', 'dark')
        } else if (value == 'clair') {
            vtfytheme.themeChoisi = 'light'    
            theme.global.name.value = 'light'
            localStorage.setItem('themeChoisi', 'light')
        } else if (value == 'goéland') {
            vtfytheme.themeChoisi = 'goelandTheme'    
            theme.global.name.value = 'goelandTheme'
            localStorage.setItem('themeChoisi', 'goelandTheme')
        } else {
            vtfytheme.themeChoisi = 'dark'    
            theme.global.name.value = 'dark'
            localStorage.setItem('themeChoisi', 'dark')
        }
    }    
</script>
