<style scoped>
.go-erreur {
    font-size: small;
    color: rgb(177, 14, 14);
    vertical-align: bottom;    
}
.floating-btn {
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 100;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
</style>

<template>
  <v-snackbar
    color="#FFCDD2"
    multi-line
    location="center"
    v-model="lesDatas.messagesErreur.bSnackbar"
    :timeout="lesDatas.messagesErreur.timeOutSnackbar"
  >
    <div v-html="lesDatas.messagesErreur.messageSnackbar"></div>
    <template v-slot:actions>
      <v-btn
        text="Fermer"
        variant="tonal"
        @click="lesDatas.messagesErreur.bSnackbar = false"
      ></v-btn>
    </template>
  </v-snackbar>

    <!-- Loader flottant -->
    <div
      v-if="loading" 
      class="loading-overlay d-flex flex-column align-center justify-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
      <div class="mt-2">{{ messageloading }}</div>
    </div>

  <v-container>
    <v-row dense v-if="libelle != ''">
        <v-col>{{ libelle }}</v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-file-input
          v-model="lesDatas.file"
          show-size
          label="Sélectionnez un fichier"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Titre</v-col>
        <v-col cols="12" md="10">
            <v-text-field
                v-model="lesDatas.document.titre"
                :rules="titreRules"
                required
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="2" class="titreChampSaisie">Famille</v-col>
        <v-col cols="12" md="3">
            <v-select
                v-model="oFamille"  
                :items="itemsFamille"
                item-title="label"
                item-value="value"
                :rules="familleRules"
                placeholder="Sélection de la famille"
                return-object
            >
            <!-- Affichage de la valeur sélectionnée -->
            <template v-slot:selection="{ item }">
                {{ item.title }}
            </template>
            </v-select>                     
        </v-col>
        <v-col cols="12" md="1"></v-col>
        <v-col cols="12" md="1" class="titreChampSaisie">Type</v-col>
        <v-col cols="12" md="2">
            <v-select
                v-model="lesDatas.document.idType"
                :items="itemsType"
                item-title="label"
                :reduce="(item) => itemsType.value"
                :rules="typeRules"
                placeholder="Sélection du type"
            ></v-select>                     
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Sujet</v-col>
        <v-col cols="12" md="10">
            <v-text-field
                v-model="lesDatas.document.sujet"
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Description</v-col>
        <v-col cols="12" md="10">
            <v-textarea
                v-model="lesDatas.document.description"
                rows="1"
                auto-grow
            ></v-textarea>                        
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Commentaire</v-col>
        <v-col cols="12" md="10">
            <v-textarea
                v-model="lesDatas.document.commentaire"
                rows="1"
                auto-grow
            ></v-textarea>                        
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">Date officielle</v-col>
        <v-col cols="12" md="3">
            <div class="go_divdate">
                <input
                    type="date"
                    id="inpDateOfficielle"
                    class="go_input"
                    v-model="lesDatas.document.dateOfficielle"
                    @keyup="inpDateOfficiellekeyup"
                ></input>
                <span class="go-erreur">&nbsp;&nbsp;&nbsp;&nbsp;{{ messagesErreurDateOfficielle }}</span>
            </div>
        </v-col>
        <v-col cols="12" md="2">
            <v-checkbox 
                label="inconnue"
                v-model="bDateOfficielleInconnue"
            ></v-checkbox>
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12" md="2" class="titreChampSaisie">
            <span>Auteur&nbsp;&nbsp;</span>
            <span v-if="lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu">
                <v-btn size="x-small" rounded="xl" class="text-none" @click="choixEmploye()">Choix employé</v-btn>
                <br>    
                <v-btn size="x-small" rounded="xl" class="text-none" @click="auteurUser()">moi</v-btn>
            </span>
            <span v-if="lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu">
                <v-btn size="x-small" rounded="xl" class="text-none" @click="choixActeur()">Choix acteur(s)</v-btn>
            </span>
       </v-col>
        <v-col cols="12" md="10">
            <div>
                <v-radio-group inline hide-details="true" v-model="lesDatas.document.documentIntExt">
                    <v-radio label="document interne" value="docInterne"></v-radio>
                    <v-radio label="document externe" value="docExterne"></v-radio>
                </v-radio-group>
            </div>
            <div v-if="lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ txtEmployeAuteur }}
            </div>
            <div v-if="!lesDatas.controle.bDataAuteurOK" class="go-erreur">l'auteur est obligatoire ou signalé inconnu</div>
            <div v-if="lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu">
                <v-container v-if="lesDatas.document.acteurAuteur.length > 0">
                    <v-row v-for="(acteurAuteur, index) in lesDatas.document.acteurAuteur" :key="acteurAuteur.idActeur" dense class="d-flex align-center">
                        <v-col cols="12" md="1">
                            <v-tooltip text="supprimer cet auteur">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                v-bind="props"
                                icon="mdi-delete"
                                variant="text"
                                @click="supprimeActeurAuteur(acteurAuteur.id)"
                                ></v-btn>
                            </template>        
                            </v-tooltip>
                        </v-col>  
                        <v-col cols="12" md="11">{{ acteurAuteur.nom }}</v-col>
                    </v-row>    
                </v-container>
            </div>
            <div>
                <v-checkbox 
                    label="inconnu"
                    v-model="bAuteurInconnu"
                ></v-checkbox>
            </div>
        </v-col>
    </v-row>
    <v-row dense>
        <v-col>
            <v-expansion-panels v-model="panelObjetsLies">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    <span  class="d-flex">
                    <span class="titreChampSaisie">Objets liés&nbsp;&nbsp;</span>
                        <v-tooltip text="ajouter un objet lié">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    rounded="lg"
                                    @click.stop="ajoutObjetLie()"
                                >+</v-btn>
                            </template>        
                        </v-tooltip>
                        &nbsp;&nbsp;
                        <v-text-field
                            dense
                            v-model="idObjetLieAjout"
                            ref="inpIdObjetLieAjout"
                            label="id objet"
                            :rules="objetLieAjoutRule"
                            style="width: 200px;"
                            @click.stop
                        ></v-text-field> 
                    </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>  
                    <v-container>
                        <v-row dense v-for="(objetlie, index) in lesDatas.document.objetsLies" :key="index" class="d-flex align-center">
                            <v-col cols="12" md="1">
                                <v-tooltip text="supprimer le lien objet">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                        v-bind="props"
                                        icon="mdi-delete"
                                        variant="text"
                                        @click="supprimeLienObjet(index)"
                                        ></v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="3">
                            {{ objetlie.type }}
                            </v-col>
                            <v-col cols="12" md="8">
                                {{ objetlie.nom }}
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            </v-expansion-panels>    
        </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="2" class="titreChampSaisie">Niveau de confidentialité</v-col>
        <v-col cols="12" md="5">
            <v-select
                v-model="lesDatas.document.idNiveauConfidentialite"
                :items="itemsNivConf"
                item-title="label"
                :reduce="(item) => itemsNivConf.value"
                placeholder="Sélectionner le niveau de confidentialité"
            ></v-select>                     
        </v-col>
    </v-row>
    <v-row v-if="lesDatas.document.idNiveauConfidentialite != '0' && lesDatas.document.idNiveauConfidentialite != '1'" dense>
        <v-col cols="12">
            <v-expansion-panels v-model="panelDroitsConsultation">
            <v-expansion-panel>
                <v-expansion-panel-title>
                    <v-container>
                        <v-row dense>
                            <v-col class="titreChampSaisie">Droits de consultation</v-col>
                            <v-col>
                                Employés
                                <v-tooltip text="ajouter un employé">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixEmployesDroitConsultation('unique')"
                                        >+1</v-btn>
                                    </template>        
                                </v-tooltip>
                                &nbsp;
                                <v-tooltip text="ajouter des employés">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            class="text-lowercase"
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixEmployesDroitConsultation('multiple')"
                                        >+n</v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col>
                                Unités
                                <v-tooltip text="ajouter une unité organisationnelle">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixUnitesOrgDroitConsultation('unique')"
                                        >+1</v-btn>
                                    </template>        
                                </v-tooltip>
                                &nbsp;
                                <v-tooltip text="ajouter des unités organisationnelle">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            class="text-lowercase"
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixUnitesOrgDroitConsultation('multiple')"
                                        >+n</v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col v-if="lesDatas.document.idNiveauConfidentialite == '5'">
                                Groupes
                                <v-tooltip text="ajouter un groupe de sécurité">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixGroupesSecuriteDroitConsultation('unique')"
                                        >+1</v-btn>
                                    </template>        
                                </v-tooltip>
                                &nbsp;
                                <v-tooltip text="ajouter des groupes de sécurité">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            class="text-lowercase"
                                            v-bind="props"
                                            rounded="lg"
                                            @click.stop="choixGroupesSecuriteDroitConsultation('multiple')"
                                        >+n</v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-title>
                <v-expansion-panel-text>  
                    <v-container>
                        <v-row dense v-for="(employedc, index) in lesDatas.document.employesDroitConsultation" :key="index" class="d-flex align-center">
                            <v-col cols="12" md="1">
                                <v-tooltip text="supprimer le droit employé">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                        v-bind="props"
                                        icon="mdi-delete"
                                        variant="text"
                                        @click="supprimeEmployeDroitConsultation(index)"
                                        ></v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="5">
                            {{ employedc.nom }} {{ employedc.prenom }}
                            </v-col>
                            <v-col cols="12" md="6">
                                {{ employedc.unite }}
                            </v-col>
                        </v-row>

                        <v-row dense v-for="(uniteorgdc, index) in lesDatas.document.unitesOrgDroitConsultation" :key="index" class="d-flex align-center">
                            <v-col cols="12" md="1">
                                <v-tooltip text="supprimer le droit unité organisationnelle">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                        v-bind="props"
                                        icon="mdi-delete"
                                        variant="text"
                                        @click="supprimeUniteOrgDroitConsultation(index)"
                                        ></v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="11">
                                {{ uniteorgdc.nom }}
                            </v-col>
                        </v-row>

                        <v-row dense v-for="(groupesecuritedc, index) in lesDatas.document.groupesSecuriteDroitConsultation" :key="index" class="d-flex align-center">
                            <v-col cols="12" md="1">
                                <v-tooltip text="supprimer le droit groupe de sécurité">
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                        v-bind="props"
                                        icon="mdi-delete"
                                        variant="text"
                                        @click="supprimeGroupeSecuriteDroitConsultation(index)"
                                        ></v-btn>
                                    </template>        
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="5">
                                {{ groupesecuritedc.nom }}
                            </v-col>
                            <v-col cols="12" md="5">
                                {{ groupesecuritedc.description }}
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expansion-panel-text>
            </v-expansion-panel>
            </v-expansion-panels>    
        </v-col>
    </v-row>
    <v-row dense>
        <v-col cols="12">
            <div v-html="messageLog"></div>        
        </v-col>
    </v-row>
  </v-container>
  
  <v-btn
    v-if="lesDatas.file !== null && lesDatas.bdataOK"
    class="floating-btn"
    color="primary"
    fab
    fixed
    bottom
    right
    @click="sauveData()"
  >
    Sauver
  </v-btn> 

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixEmploye"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
          <span class="cardTitre"><h3>Choix d'un employé</h3> (cliquez sur le nom pour sélectionner)</span>
          <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardEmployeChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <EmployeChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="'unique'"
                        @choixEmploye="receptionEmployeAuteur"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixActeur"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
          <span class="cardTitre"><h3>Choix d'un acteur</h3> (cliquez sur le nom pour sélectionner)</span>
          <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardActeurChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <ActeurChoix 
                        critereTypeInit="nom"
                        nombreMaximumRetour="50"
                        :modeChoix="'unique'"
                        @choixActeur="receptionActeurAuteur"
                    />
               </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixObjet"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
          <span class="cardTitre"><h3>Choix d'un objet</h3> (cliquez sur le nom pour sélectionner)<br>développement en cours, pas utilisable, ci-dessous choix adresse qui sera dans le futur choix objet, option [parcelle et bâtiment par adresse]</span>
          <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardObjetChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <ObjetChoix
                    modeChoix="unique"
                    @choixObjet="receptionObjet">
                </ObjetChoix>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixEmployeDC"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
            <span v-if="modeChoixEmployeDC == 'multiple'" class="cardTitre"><h3>Choix d'employés</h3> (cliquez sur le nom pour sélectionner)</span>
            <span v-else class="cardTitre"><h3>Choix d'un employé</h3> (cliquez sur le nom pour sélectionner)</span>
            <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardEmployeDCChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <EmployeChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="modeChoixEmployeDC"
                        @choixEmploye="receptionEmployesDroitConsultation"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixUniteOrgDC"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
            <span v-if="modeChoixUniteOrgDC == 'multiple'" class="cardTitre"><h3>Choix d'unités organisationnelle</h3></span>
            <span v-else class="cardTitre"><h3>Choix d'une unité organisationnelle</h3> (cliquez sur le nom pour sélectionner)</span>
            <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardUniteOrgDCChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <UniteOrgChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="modeChoixUniteOrgDC"
                        @choixUniteOrg="receptionUnitesOrgDroitConsultation"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixGroupeSecuriteDC"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
            <span v-if="modeChoixGroupeSecuriteDC == 'multiple'" class="cardTitre"><h3>Choix de groupes de sécurité</h3></span>
            <span v-else class="cardTitre"><h3>Choix d'un groupe de sécurité</h3></span>
            <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardGroupeSecuriteDCChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <GroupeSecuriteChoix 
                        :modeChoix="modeChoixGroupeSecuriteDC"
                        @choixGroupeSecurite="receptionGroupesSecuriteDroitConsultation"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
  
<script setup>
import { ref, onMounted, toRefs, watch } from 'vue'
import { storeuser } from '@/stores/user.js'
import { storedatadoc } from '@/stores/data.js'
import { documentPostProps } from '@/components/DocumentPostProps.js'
import { documentListeParSHA256, uploadFile, getDicoNiveauConfidentialite } from '@/axioscalls.js'
import { objetInfoParId } from '@/axioscalls_objet.js'
import { employeInfoParId } from '@/axioscalls_employe.js'
import { acteurInfoParId } from '@/axioscalls_acteur.js'
import EmployeChoix from '@/components/employe/EmployeChoix.vue'
import ActeurChoix from '@/components/acteur/ActeurChoix.vue'
import UniteOrgChoix from '@/components/uniteorg/UniteOrgChoix.vue';
import GroupeSecuriteChoix from '@/components/groupesecurite/GroupeSecuriteChoix.vue';
import ObjetChoix from '@/components/objet/ObjetChoix.vue'

const emit = defineEmits(['postDocument'])
const postDocument = (jsonDocument) => {
    emit('postDocument', jsonDocument)
}
const user = storeuser()
const lesDatas = storedatadoc()
/**
 * @props - définies dans DocumentPostProps.js
 */
const props = defineProps(documentPostProps)
const { libelle } = toRefs(props)
const { titre } = toRefs(props)
lesDatas.document.titre = titre.value
const { famillestypes } = toRefs(props)
const { familletitre } = toRefs(props)
const { nomfichiertitre } = toRefs(props)
const { sujet } = toRefs(props)
lesDatas.document.sujet = sujet.value
//auteuremploye, traitement special dans onmounted pour récupérer pour l'affichage le nom selon le id
const {auteuremploye} = toRefs(props)
//auteursacteur, traitement special dans onmounted pour récupérer pour l'affichage le nom selon le id
const {auteursacteur} = toRefs(props)
//objetslies, traitement special dans onmounted pour récupérer pour l'affichage type et nom selon le id
const { objetslies } = toRefs(props)
let bCardChoixObjetOpen = false
const { idniveauconfidentialite } = toRefs(props)
lesDatas.document.idNiveauConfidentialite = idniveauconfidentialite.value
const { sizemax } = toRefs(props)
lesDatas.document.sizemax = sizemax
const { suitesauve } = toRefs(props) //init ou keep
//console.log(`DocumentPost: prm suitesauve: ${suitesauve.value}`)

const itemsFamille = ref([])
const itemsType = ref([])
const oFamille = ref(null)
let itemF
for (let i=0; i<famillestypes.value.length; i++) {
    itemF = {
        id: famillestypes.value[i].id,
        label: famillestypes.value[i].label,
        value: famillestypes.value[i].value,
    }
    itemsFamille.value.push(itemF)
}
//Si il y a une seule famille, on la selectionne et on fabrique la liste des types
if (itemsFamille.value.length == 1) {
    oFamille.value = itemsFamille.value[0]
    lesDatas.document.idFamille = itemsFamille.value[0].id.toString()
    itemsType.value = []
    let itemT
    for (let j=0; j<famillestypes.value[0].type.length; j++) {
        itemT = {
            id: famillestypes.value[0].type[j].id,
            label: famillestypes.value[0].type[j].label,
            value: famillestypes.value[0].type[j].value,
        }
        itemsType.value.push(itemT)
    }
}

const itemsNivConf = await getDicoNiveauConfidentialite()
//console.log(itemsNivConf)

const bDateOfficielleInconnue = ref(false)
const bAuteurInconnu = ref(false)
const txtEmployeAuteur = ref('')

const messagesErreurDateOfficielle = ref('la date officielle est obligatoire ou signalée inconnue')

const panelObjetsLies = ref([])
const idObjetLieAjout = ref('')
const inpIdObjetLieAjout = ref(null)

const panelDroitsConsultation = ref([])
const modeChoixEmployeDC = ref('unique')
const modeChoixUniteOrgDC = ref('unique')
const modeChoixGroupeSecuriteDC = ref('unique')

const messageLog = ref('')

const loading = ref(false)
const messageloading = ref('')

const titreRules = [
    value => {
        lesDatas.controle.bDataTitreOK = false
        if (value.trim().length >= 5) {
            lesDatas.controle.bDataTitreOK = true
            return true
        }
        return 'Le titre est obligatoire et doit contenir au moins 5 caractères'
    }
]
const familleRules = [
    value => {
        lesDatas.controle.bDataFamilleOK = false
        if (value !== '') {
            lesDatas.controle.bDataFamilleOK = true
            return true
        }
        return 'choisir une famille' 
    }
]
const typeRules = [
    value => {
        lesDatas.controle.bDataTypeOK = false
        if (value !== '') {
            lesDatas.controle.bDataTypeOK = true
            return true
        }
        return 'choisir un type' 
    }
]

const objetLieAjoutRule = [
    value => {
        if (value === '') {
            return true
        }
        if (/^\+?(0|[1-9]\d*)$/.test(value)) {
            if (value > 0 && value <= 999999999) {
                return true
            } else {
                return "l'id objet est invalide > 999999999"
            }
        } else {
            return "l'id objet est invalide."
        }
    }
]

const inpDateOfficiellekeyup = () => {
    //Avec les input de type date standard du html, 
    //On peut saisir au clavier des dates invalides (31 février par exemple).
    //Mais alors la value du input est vide donc la variable v-model aussi 
    //Du coup, il faut vérifier le validity.badInput le l'objet input de type date si on veut indiquer date invalide
    //qui de toute façon ve na pas être passée plus loin mais dans ce cas, la vue à l'écran ne correspond pas à la valeur 
    //effective de la date qui est vide.
    const inpDate = document.getElementById('inpDateOfficielle')
    if (inpDate.validity.badInput) {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est invalide'
    } else {
        messagesErreurDateOfficielle.value = ''
    }
}
watch(() => lesDatas.document.dateOfficielle, () => {
    //Comme on utilise pas un composant vuetify
    //if faut faire l'equivalent des rules ici
    messagesErreurDateOfficielle.value = ''
    lesDatas.controle.bDataDateOfficielleOK = true
    if (lesDatas.document.dateOfficielle === '' && !bDateOfficielleInconnue.value) {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est obligatoire ou signalée inconnue'   
    }
})

watch(() => oFamille.value, (newValueoF, oldValueoF) => {
    if (oFamille.value !== null) {
        console.log(oFamille.value)
        //Le v-select a "return-object" et v-model="oFamille"
        //et il sert à définir la famille du document (lesDatas.document.idFamille)
        //Pourquoi tout ce binz pour retourner l'objet :
        //Parce que on veut pouvoir avoir le même idFamille pour plusieurs options
        // value: 11 label: Plan
        // value: 11 label: Plan exécutoire
        // value: 11 label: Plan de révision
        //Ce qui permet d'utiliser le label pour l'aide à la saisie du titre du document 
        //avec différent choix pour la seule famille plan
        //Si on ne fait pas ça, la selection de n'importe quelle option value 11 affiche la première option valuse 11 (Plan)
        const newValueF = newValueoF.value
        let oldValueF = null
        if (oldValueoF !== null) {
            oldValueF = oldValueoF.value    
        }
        lesDatas.document.idFamille = newValueF
        itemsType.value = []
        let itemT
        for (let i=0; i<famillestypes.value.length; i++) {
            if (famillestypes.value[i].value == newValueF) {
                for (let j=0; j<famillestypes.value[i].type.length; j++) {
                    itemT = {
                        id: famillestypes.value[i].type[j].id,
                        label: famillestypes.value[i].type[j].label,
                        value: famillestypes.value[i].type[j].value,
                    }
                    itemsType.value.push(itemT)
                }
            break;    
            }
        }
        
        if (lesDatas.file !== null&& lesDatas.document.idFamille !== null && lesDatas.document.idFamille !== '') {
            let bTrouve = false
            let fileExtension = ''
            const posi = lesDatas.file.name.lastIndexOf('.')
            if (posi !== -1) {
                fileExtension = lesDatas.file.name.substr(posi+1).toLowerCase() // important, toujours passer en minuscule
                for (let i=0; i<itemsType.value.length; i++) {
                    if (itemsType.value[i].label == fileExtension) {
                        lesDatas.document.idType = itemsType.value[i].value
                        bTrouve = true
                        break   
                    }
                }
            }
            if (!bTrouve) {
                lesDatas.document.idType = ''
                lesDatas.messagesErreur.timeOutSnackbar = 10000
                lesDatas.messagesErreur.bSnackbar = true
                lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) n'est pas prévue pour cette famille de document`
        }    
        }

        //Selon configuration familletitre "avant" ou "apres" on modifie le titre du document
        if (familletitre.value !== '') {
            let newFamille = '', oldFamille = ''
            let oFT
            let leTitre = lesDatas.document.titre
            
            if (newValueF !== '') {
                oFT = famillestypes.value.find(item => item.id === newValueoF.id)
                newFamille = oFT ? oFT.label : ''
            }
            if (oldValueF !== '' && oldValueF !== null) {
                oFT = famillestypes.value.find(item => item.id === oldValueoF.id)
                oldFamille = oFT ? oFT.label : ''
            }
            if (familletitre.value == 'apres') {
                if (!leTitre.trim().endsWith(newFamille)) {
                    if (leTitre.trim().endsWith(oldFamille) && oldFamille !== '') {
                        lesDatas.document.titre = leTitre.replace(oldFamille, newFamille)    
                    } else {
                        lesDatas.document.titre = `${leTitre} - ${newFamille}`    
                    }
                }
            } else if (familletitre.value == 'avant') {
                if (!leTitre.trim().startsWith(newFamille)) {
                    if (leTitre.trim().startsWith(oldFamille) && oldFamille !== '') {
                        lesDatas.document.titre = leTitre.replace(oldFamille, newFamille)    
                    } else {
                        let separateur = ' - '
                        if (leTitre.startsWith('de ')) {
                            separateur = ' '    
                        } else if (leTitre.startsWith(' de ')) {
                            separateur = ''
                        }
                        lesDatas.document.titre = `${newFamille}${separateur}${leTitre}`    
                }

                }
            }
        }
    //console.log(`idFamille: ${lesDatas.document.idFamille}`)
    }
})

watch(() => lesDatas.document.idType, (newValueT, oldValueT) => {
    if (lesDatas.file !== null) {
        let fileExtension = ''
        const posi = lesDatas.file.name.lastIndexOf('.')
        if (posi !== -1) {
            fileExtension = lesDatas.file.name.substr(posi+1).toLowerCase() // important, toujours passer en minuscule
            for (let i=0; i<itemsType.value.length; i++) {
                if (itemsType.value[i].value == newValueT) {
                    if (itemsType.value[i].label !== fileExtension) {
                        lesDatas.messagesErreur.timeOutSnackbar = 10000
                        lesDatas.messagesErreur.bSnackbar = true
                        lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) ne correspond pas au type choisi (${itemsType.value[i].label})`
                    }
                    break   
                }
            }
        }
    }
})

watch(() => lesDatas.file, (newValueFile, oldValueFile) => {    
    if (newValueFile !== null && newValueFile !== undefined && lesDatas.document.idFamille !== null && lesDatas.document.idFamille !== '') {
        let bTrouve = false
        let fileExtension = ''
        const posi = newValueFile.name.lastIndexOf('.')
        if (posi !== -1) {
            fileExtension = newValueFile.name.substr(posi+1).toLowerCase() // important, toujours passer en minuscule
            for (let i=0; i<itemsType.value.length; i++) {
                if (itemsType.value[i].label == fileExtension) {
                    lesDatas.document.idType = itemsType.value[i].value
                    bTrouve = true
                    break   
                }
            }
        }
        if (!bTrouve) {
            lesDatas.document.idType = ''
            lesDatas.messagesErreur.timeOutSnackbar = 10000
            lesDatas.messagesErreur.bSnackbar = true
            lesDatas.messagesErreur.messageSnackbar = `L'extension du fichier (.${fileExtension}) n'est pas prévue pour cette famille de document`
       }    
    }

    if (newValueFile !== null && newValueFile !== undefined) {
        //On vérifie que la taille du fichier ne dépasse pas la valeur limité (props du composant)
        if (newValueFile.size > lesDatas.document.sizemax) {
            lesDatas.messagesErreur.timeOutSnackbar = 60000
            lesDatas.messagesErreur.bSnackbar = true
            lesDatas.messagesErreur.messageSnackbar = `<b>Ce fichier: ${newValueFile.name} est trop volumineux.</b><br>Taille: ${newValueFile.size} Maximum autorisé: ${lesDatas.document.sizemax}`
            lesDatas.controle.bDataFileOK = false
            lesDatas.file = null
        } else {
            //On vérifie que le fichier n'a pas déjà été indexé sur goéland
            verifieNouveauSHA256()
            
            //Selon configuration nomfichiertitre à "oui" on met le nom du fichier (sans extension) comme titre du document
            if (nomfichiertitre.value == 'oui') {
                const posi = newValueFile.name.lastIndexOf('.')
                if (posi !== -1) {
                    lesDatas.document.titre = newValueFile.name.substr(0, posi)
                } else {
                    lesDatas.document.titre = newValueFile.name           
                }
            }
        }
    }
})

watch(() => bDateOfficielleInconnue.value, () => {
    if (bDateOfficielleInconnue.value) {
        lesDatas.document.dateOfficielle = ''
        lesDatas.controle.bDataDateOfficielleOK = true
        messagesErreurDateOfficielle.value = '' 
    } else if (lesDatas.document.dateOfficielle === '') {
        lesDatas.controle.bDataDateOfficielleOK = false
        messagesErreurDateOfficielle.value = 'la date officielle est obligatoire ou signalée inconnue'         
    }
})

watch(() => bAuteurInconnu.value, () => {
    if (bAuteurInconnu.value) {
        lesDatas.document.idEmployeAuteur = 0
        lesDatas.document.acteurAuteur = []
    }
    lesDatas.controle.bDataAuteurOK = true
    if ((lesDatas.document.acteurAuteur.length == 0 && lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu.value)
        ||
        (lesDatas.document.idEmployeAuteur == 0 && lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu.value)) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
})

watch(() => lesDatas.document.documentIntExt, (newValueDIE) => {
    if (newValueDIE == 'docExterne') {
        lesDatas.document.idEmployeAuteur = 0
        txtEmployeAuteur.value = ''    
    } else if (newValueDIE == 'docInterne') {
        lesDatas.document.acteurAuteur = []
    }
})

watch(() => lesDatas.document.idEmployeAuteur, (newValueIdEA) => {
    lesDatas.controle.bDataAuteurOK = true
    if (newValueIdEA == 0 && lesDatas.document.documentIntExt == 'docInterne' && !bAuteurInconnu.value) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
})

watch(() => lesDatas.document.acteurAuteur, () => {
    lesDatas.controle.bDataAuteurOK = true
    if (lesDatas.document.acteurAuteur.length == 0 && lesDatas.document.documentIntExt == 'docExterne' && !bAuteurInconnu.value) {
        lesDatas.controle.bDataAuteurOK = false    
    }    
}, { deep: true })

const auteurUser = () => {
    lesDatas.document.idEmployeAuteur = user.idEmployeUser
    txtEmployeAuteur.value = `${user.nomEmployeUser} ${user.prenomEmployeUser}`
}
const choixEmploye = () => {
    document.getElementById("btnActiveCardChoixEmploye").click() 
}
const receptionEmployeAuteur = (idemploye, jsonData) => {
    //console.log(jsonData)
    const oEmployeAuteur = JSON.parse(jsonData)
    lesDatas.document.idEmployeAuteur = oEmployeAuteur.idemploye
    txtEmployeAuteur.value = `${oEmployeAuteur.nom} ${oEmployeAuteur.prenom}. ${oEmployeAuteur.unite}`
    closeCardEmployeChoix()
}
const closeCardEmployeChoix = () => {
  document.getElementById("btnActiveCardChoixEmploye").click()    
}

const choixActeur = () => {
    document.getElementById("btnActiveCardChoixActeur").click() 
}
const receptionActeurAuteur = (idacteur, jsonData) => {
    //console.log(jsonData)
    const oActeurAuteur = JSON.parse(jsonData)
    let aoActeurAuteur = []
    if (Array.isArray(oActeurAuteur) === false) {
        aoActeurAuteur.push(oActeurAuteur)
    } else {
        aoActeurAuteur = oActeurAuteur   
    }
    console.log(aoActeurAuteur)
    for (let ai=0; ai<aoActeurAuteur.length; ai++) {
        let bdeja = false
        if (lesDatas.document.acteurAuteur.length > 0) {
            for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
                if (lesDatas.document.acteurAuteur[i].id == aoActeurAuteur[ai].acteurid) {
                    bdeja = true //déjà sélectionné
                }
            }
        }
        if (!bdeja) {
            const acteurA = {
                id: aoActeurAuteur[ai].acteurid,
                nom: aoActeurAuteur[ai].acteurnom,
            }
            lesDatas.document.acteurAuteur.push(acteurA)
        }
    }
    closeCardActeurChoix()
}
const closeCardActeurChoix = () => {
  document.getElementById("btnActiveCardChoixActeur").click()    
}

const supprimeActeurAuteur = (idacteur) => {
   if (lesDatas.document.acteurAuteur.length == 1) {
        lesDatas.document.acteurAuteur = [] 
    } else {
        for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
            if (lesDatas.document.acteurAuteur[i].id == idacteur) {
                lesDatas.document.acteurAuteur.splice(i, 1)
                break  
            }
        }       
    }
}

const ajoutObjetLie = async (idObjetPrm) => {
    if (idObjetPrm == undefined) {
        idObjetPrm = idObjetLieAjout.value.trim()
    }
    if (idObjetPrm === "") {
        //inpIdObjetLieAjout.value.$el.querySelector('input').focus()
        if (!bCardChoixObjetOpen) {
            bCardChoixObjetOpen = true
            document.getElementById("btnActiveCardChoixObjet").click()
        }    
    } else {
        if (/^\+?(0|[1-9]\d*)$/.test(idObjetPrm)) {
            if (idObjetPrm > 0 && idObjetPrm <= 999999999) {
                //On regarde si cet objet est déjà dans les objets liés
                panelObjetsLies.value = [0]
                let bTrouve = false
                for (let i=0; i<lesDatas.document.objetsLies.length; i++) {
                    if (lesDatas.document.objetsLies[i].id == idObjetPrm) {
                        bTrouve = true
                        break
                    }
                }
                if (!bTrouve) {
                    const objetInfo = await objetInfoParId(idObjetPrm)
                    if (objetInfo.length == 1) {
                        const oObjetLiePlus = {
                            "id": objetInfo[0].id,
                            "type": objetInfo[0].type,
                            "nom": objetInfo[0].nom,
                        }
                        lesDatas.document.objetsLies.push(oObjetLiePlus)
                        idObjetLieAjout.value = ''
                    } else {
                        lesDatas.messagesErreur.timeOutSnackbar = 10000
                        lesDatas.messagesErreur.bSnackbar = true
                        lesDatas.messagesErreur.messageSnackbar = `l'objet id:${idObjetPrm} n'existe pas`
                    }
                }    
            }
        }        
    }
}

const supprimeLienObjet = (index) => {
    lesDatas.document.objetsLies.splice(index, 1)
}

const closeCardObjetChoix = () => {
    if (bCardChoixObjetOpen) {
        bCardChoixObjetOpen = false
        document.getElementById("btnActiveCardChoixObjet").click()
    }    
}

const receptionObjet = (idObjet, jsonData) => {
    //console.log(jsonData)
    if (idObjet > 0) {
        ajoutObjetLie(idObjet)
    } else {
        const aoObjet = JSON.parse(jsonData)
        for (let i=0; i<aoObjet.length; i++) {
            ajoutObjetLie(aoObjet[i].id)
        }
    }
    closeCardObjetChoix()
}

const choixEmployesDroitConsultation = (modeChoix) => {
    modeChoixEmployeDC.value = modeChoix
    document.getElementById("btnActiveCardChoixEmployeDC").click() 
}
const receptionEmployesDroitConsultation = (idemploye, jsonData) => {
    const retEmployesDC = JSON.parse(jsonData)
    let aEmployesDC = []
    if (Array.isArray(retEmployesDC)) {
        aEmployesDC = retEmployesDC    
    } else {
        aEmployesDC.push(retEmployesDC)   
    }
    for (let i=0; i<aEmployesDC.length; i++) {
        let bTrouve = false
        for (let j=0; j<lesDatas.document.employesDroitConsultation.length; j++) {
            if (aEmployesDC[i].idemploye == lesDatas.document.employesDroitConsultation[j].id) {
                bTrouve= true
                break
            }
        }
        if (!bTrouve) {
            const oEmployeDCPlus = {
                "id": aEmployesDC[i].idemploye,
                "nom": aEmployesDC[i].nom,
                "prenom": aEmployesDC[i].prenom,
                "unite": aEmployesDC[i].unite,
            }
            lesDatas.document.employesDroitConsultation.push(oEmployeDCPlus)
        }
    }
    closeCardEmployeDCChoix()
    panelDroitsConsultation.value = [0]
}
const closeCardEmployeDCChoix = () => {
  document.getElementById("btnActiveCardChoixEmployeDC").click()    
}
const supprimeEmployeDroitConsultation = (index) => {
    lesDatas.document.employesDroitConsultation.splice(index, 1)
}

const choixUnitesOrgDroitConsultation = (modeChoix) => {
    modeChoixUniteOrgDC.value = modeChoix
    document.getElementById("btnActiveCardChoixUniteOrgDC").click() 
}
const receptionUnitesOrgDroitConsultation = (jsonData) => {
    //console.log(`Réception unité organisationnelle \njson: ${jsonData}`)
    const retUnitesOrgDC = JSON.parse(jsonData)
    let aUnitesOrgDC = []
    if (Array.isArray(retUnitesOrgDC)) {
        aUnitesOrgDC = retUnitesOrgDC    
    } else {
        aUnitesOrgDC.push(retUnitesOrgDC)   
    }
    for (let i=0; i<aUnitesOrgDC.length; i++) {
        let bTrouve = false
        for (let j=0; j<lesDatas.document.unitesOrgDroitConsultation.length; j++) {
            if (aUnitesOrgDC[i].id == lesDatas.document.unitesOrgDroitConsultation[j].id) {
                bTrouve= true
                break
            }
        }
        if (!bTrouve) {
            const oUniteOrgDCPlus = {
                "id": aUnitesOrgDC[i].id,
                "nom": aUnitesOrgDC[i].description,
            }
            lesDatas.document.unitesOrgDroitConsultation.push(oUniteOrgDCPlus)
        }
    }
    closeCardUniteOrgDCChoix()
    panelDroitsConsultation.value = [0]
}
const closeCardUniteOrgDCChoix = () => {
  document.getElementById("btnActiveCardChoixUniteOrgDC").click()    
}
const supprimeUniteOrgDroitConsultation = (index) => {
    lesDatas.document.unitesOrgDroitConsultation.splice(index, 1)
}

const choixGroupesSecuriteDroitConsultation = (modeChoix) => {
    modeChoixGroupeSecuriteDC.value = modeChoix
    document.getElementById("btnActiveCardChoixGroupeSecuriteDC").click() 
}
const receptionGroupesSecuriteDroitConsultation = (jsonData) => {
    //console.log(`Réception groupe sécurité \njson: ${jsonData}`)
    const aGroupesSecuriteDC = JSON.parse(jsonData)
    for (let i=0; i<aGroupesSecuriteDC.length; i++) {
        let bTrouve = false
        for (let j=0; j<lesDatas.document.groupesSecuriteDroitConsultation.length; j++) {
            if (aGroupesSecuriteDC[i].id == lesDatas.document.groupesSecuriteDroitConsultation[j].id) {
                bTrouve= true
                break
            }
        }
        if (!bTrouve) {
            const oGroupeSecuriteDCPlus = {
                "id": aGroupesSecuriteDC[i].id,
                "nom": aGroupesSecuriteDC[i].nom,
                "description": aGroupesSecuriteDC[i].description,
            }
            lesDatas.document.groupesSecuriteDroitConsultation.push(oGroupeSecuriteDCPlus)
        }
    }
    closeCardGroupeSecuriteDCChoix()
    panelDroitsConsultation.value = [0]
    console.log(lesDatas.document.groupesSecuriteDroitConsultation)
}
const closeCardGroupeSecuriteDCChoix = () => {
  document.getElementById("btnActiveCardChoixGroupeSecuriteDC").click()    
}
const supprimeGroupeSecuriteDroitConsultation = (index) => {
    lesDatas.document.groupesSecuriteDroitConsultation.splice(index, 1)
}

const sauveData = async () => {
    //const responseData = await demandeSauveData()
    const lesDatas = storedatadoc()
    let strMD5 = ''

    //Upload
    if (!lesDatas.file) {
        return
    }

    //On reverifie au cas où un utilisateur plus rapide a indexé le fichier après sa selection
    //const bNouveauSHA256 = await verifieNouveauSHA256()
    //if (!bNouveauSHA256) {
    //    return
    //}

    const formData = new FormData()
    formData.append('file', lesDatas.file)

    const aIdActeurAuteur = []
    if (lesDatas.document.acteurAuteur.length > 0) {
        for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
            aIdActeurAuteur.push(lesDatas.document.acteurAuteur[i].id)   
        }
    }

    const aIdObjetsLies = []
    if (lesDatas.document.objetsLies.length > 0) {
        for (let i=0; i<lesDatas.document.objetsLies.length; i++) {
            aIdObjetsLies.push(lesDatas.document.objetsLies[i].id)   
        }
    }

    const aIdEmployesDroitConsultation = []
    const aIdUnitesOrgDroitConsultation = []
    const aIdGroupesSecuriteDroitConsultation = []
    if (lesDatas.document.idNiveauConfidentialite != '0' && lesDatas.document.idNiveauConfidentialite != '1') {
        if (lesDatas.document.employesDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.employesDroitConsultation.length; i++) {
                aIdEmployesDroitConsultation.push(lesDatas.document.employesDroitConsultation[i].id)   
            }
        }
        if (lesDatas.document.unitesOrgDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.unitesOrgDroitConsultation.length; i++) {
                aIdUnitesOrgDroitConsultation.push(lesDatas.document.unitesOrgDroitConsultation[i].id)   
            }
        }
        if (lesDatas.document.groupesSecuriteDroitConsultation.length > 0) {
            for (let i=0; i<lesDatas.document.groupesSecuriteDroitConsultation.length; i++) {
                aIdGroupesSecuriteDroitConsultation.push(lesDatas.document.groupesSecuriteDroitConsultation[i].id)   
            }
        }
    }

    // Création de l'objet JSON avec les données attributaires
    const metadata = {
        titre: lesDatas.document.titre,
        idfamille: lesDatas.document.idFamille,
        idtype: lesDatas.document.idType,
        sujet: lesDatas.document.sujet,
        description: lesDatas.document.description,
        commentaire: lesDatas.document.commentaire,
        dateofficielle: lesDatas.document.dateOfficielle,
        documentintext: lesDatas.document.documentIntExt,
        idemployeauteur: lesDatas.document.idEmployeAuteur,
        idniveauconfidentialite: lesDatas.document.idNiveauConfidentialite,
        idacteurauteur: aIdActeurAuteur,
        idobjetslies: aIdObjetsLies,
        idEmployesDroitConsultation: aIdEmployesDroitConsultation,
        idUnitesOrgDroitConsultation: aIdUnitesOrgDroitConsultation,
        idGroupesSecuriteDroitConsultation: aIdGroupesSecuriteDroitConsultation,
    }

    // Ajout des métadonnées JSON au FormData
    console.log(metadata)
    formData.append('metadata', JSON.stringify(metadata))
    console.log("before [jsonResponseData = await uploadFile(formData)]")
    loading.value = true
    messageloading.value = "transfert du document"
    const responseData = await uploadFile(formData)
    loading.value = false
    messageloading.value = ""
    console.log(`after [responseData = await uploadFile(formData) responseData: ${JSON.stringify(responseData)}`)

    if (responseData.hasOwnProperty("success")) {
        if (responseData.hasOwnProperty("message")) {
            responseData.message = decodeURIComponent(responseData.message)    
        }
        if (responseData.hasOwnProperty("fileName")) {
            responseData.fileName = decodeURIComponent(responseData.fileName)    
        }
        if (responseData.hasOwnProperty("titre")) {
            responseData.titre = decodeURIComponent(responseData.titre)    
        }

        if (messageLog.value != '') {
                messageLog.value += '<br><br>'    
        }
        if (responseData.success) {
            messageLog.value += `${responseData.message}<br>iddocument: <a href="/goeland/document/document_data.php?iddocument=${responseData.iddocument}" target="_blank">${responseData.iddocument}</a><br>titre: ${responseData.titre}<br>taille: ${responseData.taille} octets / md5: ${responseData.md5}`    
        } else {
            messageLog.value += `<span style="color: red;">${responseData.message}</span>`    
        }
        emit('postDocument', responseData)
    } else {
        const reponseErreurServeur = {
                "success": false,
                "message": 'Erreur imprevue pas de réponse du serveur',
            }
        emit('postDocument', reponseErreurServeur)
        /*    
        //Pas de réponse prévue du serveur
        //je ne comprends pas pourquoi que bien que je sois en await
        //mon réponse data est parfois vide.
        //Dans ce cas, comme tout a bien fonctionnné et que j'ai calculer le md5 du document posté
        //On se donne une chance de continuer
        const docListe = await documentListeParSHA256(lesDatas.filemd5)
        if (docListe.length > 0) {
            const response2emechance = {
                "success": true,
                "message": 'procedure de secours recherche par md5 suite mystérieux retour serveur vide',
                "iddocument": docListe[0].iddoc,
                "titre": docListe[0].titredoc, 
                "dateofficielle": '',  
            }
            if (messageLog.value != '') {
                messageLog.value += '<br><br>' 
            }   
            messageLog.value += `${response2emechance.message}<br>iddocument: <a href="/goeland/document/document_data.php?iddocument=${response2emechance.iddocument}" target="_blank">${response2emechance.iddocument}</a><br>titre: ${response2emechance.titre}<br>md5: ${lesDatas.filemd5}`    
            emit('postDocument', response2emechance)
        } else {
            const reponseErreurServeur = {
                "success": false,
                "message": 'Erreur imprevue pas de réponse du serveur',
            }
            emit('postDocument', reponseErreurServeur)
        }
        */
    }

    //réinitialisation des données du composant
    lesDatas.file = ref(null)    
    if (suitesauve.value == "init") {
        lesDatas.document.titre = titre.value
        oFamille.value = null
        lesDatas.document.idFamille = ref(null)
        //Si il y a une seule famille, on la selectionne et on fabrique la liste des types
        if (itemsFamille.value.length == 1) {
            oFamille.value = itemsFamille.value[0]
            lesDatas.document.idFamille = itemsFamille.value[0].id.toString()
            itemsType.value = []
            let itemT
            for (let j=0; j<famillestypes.value[0].type.length; j++) {
                itemT = {
                    id: famillestypes.value[0].type[j].id,
                    label: famillestypes.value[0].type[j].label,
                    value: famillestypes.value[0].type[j].value,
                }
                itemsType.value.push(itemT)
            }
        }
        lesDatas.document.idType = ref(null)
        lesDatas.document.sujet = sujet.value
        lesDatas.document.description = ''
        lesDatas.document.commentaire = ''
        lesDatas.document.dateOfficielle = ''
        bDateOfficielleInconnue.value = false
        lesDatas.document.idEmployeAuteur = 0
        txtEmployeAuteur.value = ''
        lesDatas.document.acteurAuteur = ref([])
        bAuteurInconnu.value = false
        lesDatas.document.documentIntExt = 'docInterne'
        lesDatas.document.objetsLies = ref([])
        //ajout des objets liés passés en paramètre
        if (objetslies.value.length > 0) {
            for (let i=0; i<objetslies.value.length; i++) {
                ajoutObjetLie(objetslies.value[i])    
            }
        } 
        lesDatas.document.idNiveauConfidentialite = idniveauconfidentialite.value
    }
}

onMounted(async () => {
    //traitement auteuremploye passé en paramètre
    if (auteuremploye.value != '') {
        //console.log(auteuremploye.value)
        const idEmployeAuteurPrm = auteuremploye.value
        const employeAuteurInfo = await employeInfoParId(idEmployeAuteurPrm)
        //console.log(employeAuteurInfo)
        if (employeAuteurInfo.length != 0) {
            const oEmployeAuteur = employeAuteurInfo[0]
            lesDatas.document.documentIntExt = 'docInterne'
            lesDatas.document.idEmployeAuteur = idEmployeAuteurPrm
            txtEmployeAuteur.value = `${oEmployeAuteur.nom} ${oEmployeAuteur.prenom}. ${oEmployeAuteur.unite}`
        }
    }

    //traitement auteursacteur passé en paramètre. Si auteuremploye passé, auteursacteur ignoré
    //console.log(auteursacteur.value)
    if (auteuremploye.value == '' && auteursacteur.value.length > 0) {
        lesDatas.document.documentIntExt = 'docExterne'
        for (let i=0; i<auteursacteur.value.length; i++) {
            const idActeurAuteurPrm = auteursacteur.value[i]
            //On vérifie que la liste passée en paramètre n'a pas de doublon
            let bTrouve = false
            if (lesDatas.document.acteurAuteur.length > 0) {
                for (let i=0; i<lesDatas.document.acteurAuteur.length; i++) {
                    if (lesDatas.document.acteurAuteur[i].id == idActeurAuteurPrm) {
                        bTrouve = true
                        break
                    }
                }
            }
            if (!bTrouve) {
                const acteurAuteurInfo = await acteurInfoParId(idActeurAuteurPrm)
                //console.log(acteurAuteurInfo)
                if (acteurAuteurInfo.length != 0) {
                    const acteurA = {
                        id: acteurAuteurInfo[0].acteurid,
                        nom: acteurAuteurInfo[0].acteurnom,
                    }
                    lesDatas.document.acteurAuteur.push(acteurA)
                }
            }                       
        }
    }

    //ajout des objets liés passés en paramètre
    if (objetslies.value.length > 0) {
        for (let i=0; i<objetslies.value.length; i++) {
            ajoutObjetLie(objetslies.value[i])    
        }
    } 
})

const verifieNouveauSHA256 = async () => {
    const lesDatas = storedatadoc()
    if (!lesDatas.file) {
        return true
    } 

    try {
        loading.value = true
        messageloading.value = "vérification que le document n'existe pas déjà sur goéland"
        const strSHA256 = await calculateSHA256(lesDatas.file);
        lesDatas.filesha256 = strSHA256
        const docListe = await documentListeParSHA256(strSHA256)
        loading.value = false
        messageloading.value = ""
        if (docListe.length > 0) {
            lesDatas.messagesErreur.timeOutSnackbar = 60000
            lesDatas.messagesErreur.bSnackbar = true
            lesDatas.messagesErreur.messageSnackbar = `<b>Ce document existe déjà sur goéland</b><br><b>Id:</b> ${docListe[0].iddoc}<br><b>Titre:</b> ${docListe[0].titredoc}<br><i>indexé le ${docListe[0].dateindexation} par ${docListe[0].empcreateur} / ${docListe[0].uniteorgcreateur}</i>`
            lesDatas.controle.bDataFileOK = false
            return false
        } else {
            lesDatas.controle.bDataFileOK = true
            return true
        }
    } catch (error) {
        loading.value = false
        messageloading.value = ""
        console.error('Erreur de calcul du hash:', error);
        lesDatas.messagesErreur.timeOutSnackbar = 60000
        lesDatas.messagesErreur.bSnackbar = true
        lesDatas.messagesErreur.messageSnackbar = `<b>Erreur de calcul du hash:</b><br><b>Id:</b> ${error}</b>`
        lesDatas.controle.bDataFileOK = false
        return false
    }
}

async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
}

// Fonction pour calculer le hash SHA-256 d'un fichier
async function calculateSHA256(file) {
    return new Promise((resolve, reject) => {
        // Vérifier si l'API Web Crypto est disponible
        if (!window.crypto || !window.crypto.subtle) {
            reject(new Error('Web Crypto API non supportée'));
            return
        }

        // Créer un FileReader pour lire le contenu du fichier
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                // Convertir le contenu du fichier en ArrayBuffer
                const arrayBuffer = event.target.result

                // Calculer le hash SHA-256
                const hashBuffer = await window.crypto.subtle.digest(
                    'SHA-256', 
                    arrayBuffer
                )

                // Convertir le hash en chaîne hexadécimale
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')

                resolve(hashHex);
            } catch (error) {
                reject(error)
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Lire le fichier comme un ArrayBuffer
        reader.readAsArrayBuffer(file);
    })
}
</script>