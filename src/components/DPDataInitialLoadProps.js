/**
 * Fichier de configuration
 * @prop {string} codeConfigIni - Détermine le fichier de configuration json contenant 
 * la valeur de certaines propriétes à passer au composant DocumentPost
 * 
 * Chaine json de configuration
 * @prop {string} jsonConfigIni - Chaine json contenant la valeur de certaines propriétés
 * à passer au composant DocumentPost
 * Les éventuelles propriétés définies dans le fichier défini par codeConfigIni ET dans jsonConfigIni
 * seront celles de jsonConfigIni, celles du fichier étant ignorée
 * 
 * Comportement après sauvegarde
 * @prop {string} suitesauve - Défini le comportement après la sauvegarde du document
 * pagedata - ouvre la page de consultation des metadonnées du document
 * pageedit - Ouvre la page goéland d'édition des métdonnées du document
 * keep - Conserve les données saisies sauf le fichier à poster
 * emitinit - Emet l'évènement postDocument, réinitialise les données selon la configuration initiale
 * emitkeep - Emet l'évènement postDocument, conserve les données saisies sauf le fichier à poster
 * emitdocsinit - Stoque informations dans l'objet qui sera emis au clic sur [Indexation terminée], réinitialise les données selon la configuration initiale
 * emitdocskeep - Stoque informations dans l'objet qui sera emis au clic sur [Indexation terminée], conserve les données saisies sauf le fichier à poster

 * @example
 * codeConfigIni : photo - va lire sur le serveur le fichier /goeland/document/nouveau/json/photo.json
 * jsonConfigIni : {"titre":"Gare 22 - ","sujet":"#444","auteursacteur":[10000],"objetslies":[1000,10000]}
 */
export const dpDataInitialLoadProps = {
    codeConfigIni: {
        type: String,
        default() {
          return ''
        } 
    },
    jsonConfigIni: {
        type: String,
        default() {
            return ''
        } 
    },
    suitesauve: {
        type: String,
        default() {
            return 'pagedata'
        }
    },
}
