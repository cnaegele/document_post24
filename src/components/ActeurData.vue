<style>
  .coltitre {
    font-weight: bold;
  }
  .colinfoimportant {
    color: red;
  }
  .colmessage {
    font-style: italic;
    font-weight: lighter;
  }
  .colinfo {
    font-size: small;
  }
  a.ago {
    text-decoration: none;
    color: inherit;
  }
  .bactif0 {
    font-style: italic;
    color: rgb(252, 182, 182)
  }
  .bactif1 {
    font-style: normal;
  }
  .goroledate {
    text-align: right;
  }
</style>

<template>
<div v-if="messageErreur == ''">
  <v-container v-if="bInGroupDocumentAucunAcces !== 1">
    <v-row v-if="acteurD.bactif == '0'" no-gutters>
      <v-col cols="12" md="12" class="colinfoimportant">Acteur désactive <span v-if="acteurD.datedesactivation !== undefined && acteurD.datedesactivation !== null"> le {{ acteurD.datedesactivation }}</span></v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="2" class="coltitre">Nom</v-col>
      <v-col cols="12" md="10">{{ acteurD.acteurnom }}</v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="2" class="coltitre">Adresse</v-col>
      <v-col cols="12" md="10"><div v-html="acteurD.acteuradresse"></div></v-col> <!-- v-html pour garder les <br/>-->
    </v-row>
    <v-row v-if="acteurD.acteurcommentaire !== undefined && acteurD.acteurcommentaire !== null" no-gutters>
      <v-col cols="12" md="2" class="coltitre">Commentaire</v-col>
      <v-col cols="12" md="10"><div v-html="acteurD.acteurcommentaire"></div></v-col> <!-- v-html pour garder les <br/>-->
    </v-row>
    <v-row v-for="complement in acteurDCompl" no-gutters>
      <v-col cols="12" md="2" class="coltitre">{{ complement.acteurcomplementtype }}</v-col>
      <v-col cols="12" md="10"><div v-html="complement.acteurcomplement"></div></v-col> <!-- v-html pour garder les <br/>-->
    </v-row>
    <v-row no-gutters v-if="acteurDataAdresse.length > 1">
      <v-col cols="12" md="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>détail adresses ({{ acteurDataAdresse.length }})</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-for="adresse in acteurDataAdresse">
                <div class="colinfo" v-if="adresse.acadcalification !== null">{{ adresse.acadcalification }}</div>
                <div v-if="adresse.actadruenumero !== null">{{ adresse.actadruenumero }}</div>
                <div v-if="adresse.actadcpville !== null">{{ adresse.actadcpville }}</div>
                <div v-if="adresse.actadpays !== 'Suisse'">{{ adresse.actadpays }}</div>
                <div v-if="adresse.actadcomplement !== null">{{ adresse.actadcomplement }}</div>
                <div>&nbsp;</div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="acteurDataActeurLie.length > 0">
      <v-col cols="12" md="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="coltitre">Acteurs liés ({{ acteurDataActeurLie.length }})</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container>
                <v-row v-for="acteurlie in acteurDataActeurLie">
                  <v-col cols="12" md="2">{{ acteurlie.actaclrolecontact }}</v-col>
                  <v-col cols="12" md="8">{{ acteurlie.actaclnom }}</v-col>
                </v-row>
                </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>        
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="nbrRoles > 0">
      <v-col cols="12" md="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="coltitre">Rôles ({{ nbrRoles }})</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="typerole in acteurDRole">
                  <v-expansion-panel-title>{{ typerole.acteurrolerole }} ({{ typerole.acteurnbrelements }})</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-container>
                      <v-row v-for="roleel in typerole.acteurroleelements" no-gutters>
                        <v-col cols="12" md="2">{{ roleel.aroleobjet }}</v-col>
                        <v-col cols="12" md="8"
                          v-if="roleel.aroleobjetnom !== null && roleel.aroleobjetdroitacces > 0"
                          :class="`bactif${roleel.aroleobjetbactif}`"
                          v-html="`<a class='ago' target='_blank' href='${roleel.aroleobjeturl}'><span  class='bactif${roleel.aroleobjetbactif}'>${roleel.aroleobjetnom}</span></a>`"
                        >
                        </v-col>
                        <v-col cols="12" md="8"
                          v-else-if="roleel.aroleobjetnom !== null && roleel.aroleobjetdroitacces == 0"
                          class="colmessage"
                        >
                          données confidentielles 
                        </v-col>
                        <v-col cols="12" md="8"
                          v-else
                          class="colmessage"
                        >
                          {{ roleel.aroleobjet }} {{ roleel.aroleidobjet }} n'existe plus. Prévenir le support goéland 
                        </v-col>
                        <v-col cols="12" md="2" class="goroledate">{{ roleel.aroledatecreation }}</v-col>  
                      </v-row>  
                    </v-container>  
                  </v-expansion-panel-text>
                </v-expansion-panel>  
              </v-expansion-panels>  
            </v-expansion-panel-text>
          </v-expansion-panel>        
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="12" class="colinfo">Création le {{ acteurD.datecreation }}. <span v-if="acteurD.datemodification !== null"> Dernière modification le {{ acteurD.datemodification }}.</span> id goéland: {{ acteurD.acteurid }}</v-col>
    </v-row>
  </v-container>
  <div v-else>
    <h3>Vous n'avez pas l'autorisation d'accèder aux données acteurs de goéland</h3>  
  </div>
</div>
<div else v-html="messageErreur"></div>
</template>

<script setup>
import { ref } from 'vue'
import { getDataUserInfo, 
        getActeurData, 
        getActeurDataAdresse, 
        getActeurDataComplement,
        getActeurDataActeurLie, 
        getActeurDataRole } from '../axioscalls.js'
const props = defineProps({
  acteurId: String,
})
const messageErreur = ref('')
const acteurId = ref(props.acteurId)
const bInGroupDocumentAucunAcces = ref(1)
const acteurD = ref({})
let acteurDataAdresse = ref([])
let acteurDataComplement = ref([])
let acteurDataActeurLie = ref([])
let acteurDataRole = []
let acteurDRole = []
let acteurDCompl = []
const nbrRoles = ref(0)

const userInfo = await getDataUserInfo('DocumentAucunAcces')
if (userInfo.hasOwnProperty('id_employe')) {
  const idEmploye = userInfo.id_employe
  bInGroupDocumentAucunAcces.value = userInfo.bingroupe
  let acteurData = await getActeurData(acteurId.value)
  if (acteurData.hasOwnProperty('message')) {
    messageErreur.value += acteurData.message + '<br>'
    acteurData = []
  }
  acteurDataAdresse.value = await getActeurDataAdresse(acteurId.value)
  if (acteurDataAdresse.value.hasOwnProperty('message')) {
    messageErreur.value += acteurDataAdresse.value.message + '<br>'
    acteurDataAdresse.value = []
  }
  acteurDataComplement.value = await getActeurDataComplement(acteurId.value)
  if (acteurDataComplement.value.hasOwnProperty('message')) {
    messageErreur.value += acteurDataComplement.value.message + '<br>'
    acteurDataComplement.value = []
  }
  acteurDataActeurLie.value = await getActeurDataActeurLie(acteurId.value)
  if (acteurDataActeurLie.value.hasOwnProperty('message')) {
    messageErreur.value += acteurDataActeurLie.value.message + '<br>'
    acteurDataActeurLie.value = []
  }
  acteurDataRole = await getActeurDataRole(acteurId.value, idEmploye)
  if (acteurDataRole.hasOwnProperty('message')) {
    messageErreur.value += acteurDataRole.message + '<br>'
    acteurDataRole = []
  }
  //console.log(userInfo)
  //console.log(acteurData)
  //console.log(acteurDataAdresse)
  //console.log(acteurDataComplement)
  //console.log(acteurDataActeurLie)
  //console.log(acteurDataRole)

  if (acteurData.length > 0) {
    acteurD.value = acteurData[0]
  }
  //Compléments
  //tout le binz ci-dessous pour afficher plus joli les cas avec plusieurs type de complément identique
  //et les cas spéciaux avec un url 
  const transformActeurDCompl = (acteurDataComplement) => {
    const nbrComplements = acteurDataComplement.length
    const aActeurDCompl = []
    if (nbrComplements > 0) {
      let idTypeComplement = acteurDataComplement[0].acteurcomplementtypeid
      let idTypeComplementPrec = idTypeComplement
      let typeComplement = acteurDataComplement[0].acteurcomplementtype
      let urlRegCom
      let complement = '', complementplus
      if (idTypeComplement == '22') {
        urlRegCom = acteurDataComplement[0].acteurcomplement
      } else if (idTypeComplement == '8') {
        complement = `<a class="ago" href="${acteurDataComplement[0].acteurcomplement}" target="_blank">${acteurDataComplement[0].acteurcomplement}</a>`
      } else if (idTypeComplement == '24') {
        complement = `<a class="ago" href="https://debiteur.lausanne.ch/debiteur-ui/details-debiteur/${acteurDataComplement[0].acteurcomplement}" target="_blank">${acteurDataComplement[0].acteurcomplement}</a>`
      } else {
        complement = acteurDataComplement[0].acteurcomplement
      }
      let oActeurDCompl 
      for (let i=1; i<acteurDataComplement.length; i++) {
        idTypeComplement = acteurDataComplement[i].acteurcomplementtypeid
        if (idTypeComplement == '22') {
          urlRegCom = acteurDataComplement[i].acteurcomplement
          idTypeComplementPrec = '22' 
        } else {
          if (idTypeComplement != idTypeComplementPrec) {
            if (idTypeComplementPrec != 22) {
              oActeurDCompl = {
                "acteurcomplementtype" : typeComplement, 
                "acteurcomplement" : complement, 
              }
              aActeurDCompl.push(oActeurDCompl)
            }
            idTypeComplementPrec = idTypeComplement
            typeComplement = acteurDataComplement[i].acteurcomplementtype
            if (idTypeComplement == '21') {
              complement = `<a class="ago" href="${urlRegCom}" target="_blank">${acteurDataComplement[i].acteurcomplement}</a>`
            } else if (idTypeComplement == '8') {
              complement = `<a class="ago" href="${acteurDataComplement[i].acteurcomplement}" target="_blank">${acteurDataComplement[i].acteurcomplement}</a>`
            } else if (idTypeComplement == '24') {
              complement = `<a class="ago" href="https://debiteur.lausanne.ch/debiteur-ui/details-debiteur/${acteurDataComplement[i].acteurcomplement}" target="_blank">${acteurDataComplement[i].acteurcomplement}</a>`
            } else {
                complement = acteurDataComplement[i].acteurcomplement
              }
          } else {
            if (idTypeComplement == '8') {
              complementplus = `<a class="ago" href="${acteurDataComplement[i].acteurcomplement}" target="_blank">${acteurDataComplement[i].acteurcomplement}</a>`
            } else if (idTypeComplement == '24') {
              complement = `<a class="ago" href="https://debiteur.lausanne.ch/debiteur-ui/details-debiteur/${acteurDataComplement[i].acteurcomplement}" target="_blank">${acteurDataComplement[i].acteurcomplement}</a>`
            } else {
              complementplus = acteurDataComplement[i].acteurcomplement
            }
            complement = `${complement}<br>${complementplus}`  
          }
        }
      }
      typeComplement = typeComplement.replace("ABACUS", "")
      oActeurDCompl = {
        "acteurcomplementtype" : typeComplement, 
        "acteurcomplement" : complement, 
      }
      aActeurDCompl.push(oActeurDCompl) 
    } 
    return aActeurDCompl
  }
  acteurDCompl = transformActeurDCompl(acteurDataComplement)
  //console.log(acteurDCompl)

  //Rôles
  nbrRoles.value = acteurDataRole.length
  //Tout ce binz pour regrouper par rôle
  const transformActeurDRole = (acteurDataRole) => {
    const aActeurDRole = []
    let oActeurDRole
    //Liste distincte des rôles
    const aacRoleRole = [...new Set(acteurDataRole.map(item => item.acrolerole))]
    const nbracRoleRole = aacRoleRole.length
    //console.log(aacRoleRole)
    //Regroupement par rôle
    let role, nbrEls
    for (let i=0; i<nbracRoleRole; i++) {
      role = aacRoleRole[i]
      const roleEls = acteurDataRole.filter(item => item.acrolerole === role);
      nbrEls = roleEls.length
      oActeurDRole = {
        "acteurrolerole" : role,
        "acteurnbrelements" : nbrEls,
        "acteurroleelements" : roleEls
      }
      aActeurDRole.push(oActeurDRole)
    }
    return aActeurDRole
  }
  if (nbrRoles.value > 0) {
    acteurDRole = transformActeurDRole(acteurDataRole)
  }  
} else {
  if (userInfo.hasOwnProperty('message')) {
    messageErreur.value += userInfo.message + '<br>'
  } else {
    messageErreur.value += 'erreur inconnue :: getDataUserInfo<br>'  
  }
}
</script>