<?php
require_once 'gdt/cldbgoeland.php';
//require 'gdt/gautentificationf5.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:  *");
header("Access-Control-Allow-Methods:  OPTIONS, POST");
$idCaller = 6;
//$idCaller = 0;
//if (array_key_exists('empid', $_SESSION)) {
//    $idCaller = $_SESSION['empid'];
//}
$response = [
    'success' => false,
    'message' => rawurlencode('initialisation response dans document_post.php')
];

if ($idCaller > 0) {
    // dossier de téléchargement défini dans /data/config/goeland.ini
    $a_config = parse_ini_file('/data/config/goeland.ini', true);
    $uploadDir = '';
    $urlRoot = '';
    $basePath = '';
    if (array_key_exists('production', $a_config)) {
        if (array_key_exists('documents.uploaddir', $a_config['production'])) {
            $uploadDir = $a_config['production']['documents.uploaddir'];
        }
        if (array_key_exists('documents.urlroot', $a_config['production'])) {
            $urlRoot = $a_config['production']['documents.urlroot'];
        }
        if (array_key_exists('documents.basepath', $a_config['production'])) {
            $basePath = $a_config['production']['documents.basepath'];
        }
    }

    if ($uploadDir == '' || $urlRoot == '' || $basePath == '') {
        $response = [
            'success' => false,
            'message' => rawurlencode('uploaddir ou/et  urlroot ou/et basepath non défini')
        ];
    } else {
        $uploadDir = $a_config['production']['documents.uploaddir'];
        // Vérifiez si un fichier a été upload
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            // Récupérez les informations du fichier
            $fileNameClient = basename($_FILES['file']['name']);
            $fileSize = $_FILES['file']['size'];
            $fileType = $_FILES['file']['type'];
            //extention (éventuelle)
            $extensionClient = '';
            $pospoint = strrpos($fileNameClient, '.');
            if ($pospoint !== false) {
                $extensionClient = strtolower(substr($fileNameClient, $pospoint+1)); //important, extension toujours en minuscule
                if (strlen(str_replace(' ', '',  $extensionClient)) > 4) {
                    $extensionClient = '';
                }
            }
            //nom de fichier temporaire unique
            $fileNameUnique = "emp$idCaller" . uniqid("_") . '.' . $extensionClient;
            $targetFilePath = $uploadDir . $fileNameUnique;

            // Métadonnées JSON
            $metadata = json_decode($_POST['metadata'], true);

            // Déplacement du fichier téléchargé vers le répertoire d'upload
            if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
                // Téléchargement ok

                //Contrôle MD5 n'existe pas déjà en base de données. Déjà fait au niveau du client mais on refait quand même
                $strMD5 = strtoupper(md5_file($targetFilePath));
                $sSql = "cn_document_liste_parmd5 '$strMD5'";
                $dbgo = new DBGoeland();
                $dbgo->queryRetJson2($sSql);
                $strJson = $dbgo->resString;
                unset($dbgo);
                if ($strJson == '[]')  {
                    $fileSize = filesize($targetFilePath);

                    //Contrôle cohérence type document, mimetype, extension
                    $docExtension = $extensionClient;
                    if ($docExtension == 'jpeg') {
                        $docExtension = 'jpg'; //on utilise jpg dans goéland
                    }
                    $idType = $metadata['idtype'] ?? '0';
                    //Le mime type reçu avec $_FILES['file']['type']ne dépend que de l'extension depuis un POST de microsoft.
                    //Pour certain type, on fait une vérification plus sérieuse.
                    $typectrl = 'extension';
                    switch ($idType) {
                        case 2:  //tif
                        case 5:  //jpg
                        case 15: //pdf
                        case 18: //txt
                        case 20: //png
                        case 21: //docx
                        case 22: //xlsx
                            $finfo = finfo_open(FILEINFO_MIME_TYPE);
                            $fileType = finfo_file($finfo, $targetFilePath);
                            $typectrl = 'contenu';
                            break;
                        default:
                            $typectrl = 'extension';
                            break;
                    }

                    $sSql = "CN_DocumentCtrlTypeExtMimeT $idType,'$extensionClient','$fileType','$typectrl'";
                    $dbgo = new DBGoeland();
                    $dbgo->queryRetInt($sSql);
                    $resInt = $dbgo->resInt;
                    unset($dbgo);
                    if ($resInt !== 0) {
                        // Traitement métadonnées
                        $titre = prepareMSSQLvarchar($metadata['titre'] ?? '');
                        $idFamille = $metadata['idfamille'] ?? '0';
                        $sujet = prepareMSSQLvarchar($metadata['sujet'] ?? '');
                        $description = prepareMSSQLvarchar($metadata['description'] ?? '');
                        $commentaire = prepareMSSQLvarchar($metadata['commentaire'] ?? '');
                        $dateOfficielle = $metadata['dateofficielle'] ?? '';
                        $documentIntExt = $metadata['documentintext'] ?? '';
                        $idemployeAuteur = $metadata['idemployeauteur'] ?? '0';
                        $idNiveauConfidentialite = $metadata['idniveauconfidentialite'] ?? '6';  //restrictif si pas passé
                        $aIdActeurAuteur = $metadata['idacteurauteur'] ?? []; //Il peut y en avoir plusieurs
                        $aIdObjetsLies = $metadata['idobjetslies'] ?? [];
                        $aIdEmployesDroitConsultation = $metadata['idEmployesDroitConsultation'] ?? [];
                        $aIdUnitesOrgDroitConsultation = $metadata['idUnitesOrgDroitConsultation'] ?? [];
                        $aIdGroupesSecuriteDroitConsultation = $metadata['idGroupesSecuriteDroitConsultation'] ?? [];

                        $bDocExterne = '0';
                        if ($documentIntExt == 'docExterne') {
                            $bDocExterne = '1';
                        }

                        $bDataOK = true;
                        $message = '';
                        if (strlen($titre) < 5) {
                            $bDataOK = false;
                            $message .= 'Titre invalide, longueur minimum 5 caractères<br>';
                        }
                        if ($idFamille == '0') {
                            $bDataOK = false;
                            $message .= 'Famille non définie<br>';
                        }
                        if ($idType == '0') {
                            $bDataOK = false;
                            $message .= 'Type non défini<br>';
                        }
                        if ($documentIntExt == '') {
                            $bDataOK = false;
                            $message .= 'Document interne ou externe non défini<br>';
                        }
                        if ($bDataOK) {
                            $sSqlInsert = "CN_DocumentInsert2 $idFamille,$idType";
                            if ($idemployeAuteur != '0') {
                                $sSqlInsert .= ",$idemployeAuteur";
                            } else {
                                $sSqlInsert .= ",NULL";
                            }
                            $sSqlInsert .= ",$idCaller,'$titre'";
                            if ($description) {
                                $sSqlInsert .= ",'$description'";
                            } else {
                                $sSqlInsert .= ",NULL";
                            }
                            if ($sujet) {
                                $sSqlInsert .= ",'$sujet'";
                            } else {
                                $sSqlInsert .= ",NULL";
                            }
                            if ($commentaire) {
                                $sSqlInsert .= ",'$commentaire'";
                            } else {
                                $sSqlInsert .= ",NULL";
                            }
                            if ($dateOfficielle) {
                                $sSqlInsert .= ",'$dateOfficielle'";
                            } else {
                                $sSqlInsert .= ",NULL";
                            }
                            $sSqlInsert .= ",$bDocExterne,$idNiveauConfidentialite,$fileSize,'$strMD5'";
                            $dbgo = new DBGoeland();
                            $dbgo->queryRetString($sSqlInsert, 'W');
                            $sXmlRetInsert = $dbgo->resString;
                            unset($dbgo);

                            //Chargement resultat xml de la SP
                            $domDRes = new domdocument();
                            $domDRes->loadXML(utf8go_encode($sXmlRetInsert));
                            $nodes = $domDRes->getElementsByTagName('ERREUR');
                            if ($nodes->length == 1) {
                                $message = "Problème lors de l'insertion du document en base de données. " . $nodes->item(0)->nodeValue;
                                $response = [
                                    'success' => false,
                                    'message' => rawurlencode($message)
                                ];
                            } else {
                                $idDocument = $domDRes->getElementsByTagName('IdDocument')->item(0)->nodeValue;
                                $idDocStorage = $domDRes->getElementsByTagName('IdDocStorage')->item(0)->nodeValue;
                                $pathDestination = $domDRes->getElementsByTagName('UrlPath')->item(0)->nodeValue;
                                //Insertion initiale ok, transfert effectif du fichier vers sa(ses) destination(s)
                                $nomFichier = "$idDocument.$docExtension";
                                $pathDestinationLocal = str_replace($urlRoot, $basePath, $pathDestination);
                                $message = '';
                                $bRet = true;
                                if (!is_dir($pathDestinationLocal)) {
                                    $bRet = mkdir($pathDestinationLocal);
                                    if (!$bRet) {
                                        $message .= 'Création du répertoire local ' . $pathDestinationLocal . ' impossible<br>';
                                    }
                                }
                                if ($bRet) {
                                    $bRet = copy($targetFilePath, $pathDestinationLocal . $nomFichier);
                                    if (!$bRet) {
                                        $message .= 'Copie locale du document vers ' . $pathDestinationLocal . $nomFichier . ' impossible !';
                                    }
                                }
                                if ($bRet) {
                                    //Transfert ok, mise à jour DB
                                    $sSql = "CN_DocumentUpdateApresPOSTInitial $idDocument,$idDocStorage";
                                    $dbgo = new DBGoeland();
                                    $dbgo->queryRetNothing($sSql, 'W');
                                    unset($dbgo);

                                    //Si c'est un document externe, sauvegarde de(s) auteur(s) dans ActeurRole
                                    if (count($aIdActeurAuteur) > 0) {
                                        for($i=0; $i<count($aIdActeurAuteur); $i++) {
                                            $idActeur = $aIdActeurAuteur[$i];
                                            $sSql = "CN_ActeurRoleInsert $idActeur,8,'Document',$idDocument,NULL";
                                            $dbgo = new DBGoeland();
                                            $dbgo->queryRetNothing($sSql,'W');
                                            unset($dbgo);
                                        }
                                    }

                                    //Sauvegarde des éventuels liens document - objets
                                    if (count($aIdObjetsLies) > 0) {
                                        $sSqls = [];
                                        for($i=0; $i<count($aIdObjetsLies); $i++) {
                                            $idObjet = $aIdObjetsLies[$i];
                                            $sSqls[$i] = "CN_LienThingDocumentInsert $idObjet,$idDocument";
                                        }
                                        $dbgo = new DBGoeland();
                                        $dbgo->queriesRetNothing($sSqls,'W');
                                        unset($dbgo);
                                        unset($sSqls);
                                    }

                                    //Sauvegarde des éventuels droits d'accès
                                    if (count($aIdEmployesDroitConsultation) > 0) {
                                        $sSqls = [];
                                        for($i=0; $i<count($aIdEmployesDroitConsultation); $i++) {
                                            $idEmploye = $aIdEmployesDroitConsultation[$i];
                                            $sSqls[$i] = "CN_DocumentEmployeAccesInsert $idDocument, $idEmploye";
                                        }
                                        $dbgo = new DBGoeland();
                                        $dbgo->queriesRetNothing($sSqls,'W');
                                        unset($dbgo);
                                        unset($sSqls);
                                    }
                                    if (count($aIdUnitesOrgDroitConsultation) > 0) {
                                        $sSqls = [];
                                        for($i=0; $i<count($aIdUnitesOrgDroitConsultation); $i++) {
                                            $idUniteOrg = $aIdUnitesOrgDroitConsultation[$i];
                                            $sSqls[$i] = "CN_DocumentOrgUnitAccesInsert $idDocument, $idUniteOrg";
                                        }
                                        $dbgo = new DBGoeland();
                                        $dbgo->queriesRetNothing($sSqls,'W');
                                        unset($dbgo);
                                        unset($sSqls);
                                    }
                                    if (count($aIdGroupesSecuriteDroitConsultation) > 0) {
                                        $sSqls = [];
                                        for($i=0; $i<count($aIdGroupesSecuriteDroitConsultation); $i++) {
                                            $idGroupe = $aIdGroupesSecuriteDroitConsultation[$i];
                                            $sSqls[$i] = "CN_DocumentGroupeAccesInsert $idDocument, $idGroupe";
                                        }
                                        $dbgo = new DBGoeland();
                                        $dbgo->queriesRetNothing($sSqls,'W');
                                        unset($dbgo);
                                        unset($sSqls);
                                    }

                                    // Réponse OK
                                    $message = 'Document [' . $fileNameClient . '] indexé avec succès';
                                    $response = [
                                        'success' => true,
                                        'message' => rawurlencode($message),
                                        'fileName' => rawurlencode("$fileNameClient -> $fileNameUnique -> $nomFichier"),
                                        'titre' => rawurlencode(utf8go_encode($titre)),
                                        'iddocument' => $idDocument,
                                        'dateofficielle' => $dateOfficielle,
                                        'taille' => $fileSize,
                                        'md5' => $strMD5,
                                    ];
                                } else {
                                    $response = [
                                        'success' => false,
                                        'message' => rawurlencode($message)
                                    ];
                                }
                            }
                        } else {
                            $response = [
                                'success' => false,
                                'message' => rawurlencode($message),
                            ];
                        }
                    } else {
                        $message = 'Type document invalide ! Id: ' . $idType . ' Type: ' . $extensionClient . ' Mimetype: ' . $fileType . ' (Une adaptation de la table TypeDocument est peut-être requise)';
                        $message = $sSql;
                        $response = [
                            'success' => false,
                            'message' => rawurlencode($message)
                        ];
                    }
                } else {
                    $oDoc = json_decode($strJson, true);
                    $message = 'Ce document existe déjà sur goéland.<br>';
                    $message .= 'IdDocument:' . $oDoc[0]['iddoc'] . '<br>';
                    $message .= 'Titre:' . $oDoc[0]['titredoc'] . '<br>';
                    $message .= 'Indexé le ' . $oDoc[0]['dateindexation'] . ' par ' . $oDoc[0]['empcreateur'] . '. (' . $oDoc[0]['uniteorgcreateur'] . ')';
                    $response = [
                        'success' => false,
                        'message' => rawurlencode($message)
                    ];
                }
            } else {
                // Erreur lors du déplacement du fichier
                $response = [
                    'success' => false,
                    'message' => 'Erreur lors du déplacement du fichier'
                ];
            }
        } else {
            // Aucun fichier n'a été téléchargé ou une erreur s'est produite
            $response = [
                'success' => false,
                'message' => rawurlencode('Erreur lors du téléchargement du fichier')
            ];
        }
    }
} else {
    $response = [
        'success' => false,
        'message' => rawurlencode('Erreur autentification impossible')
    ];
}

// Envoyez la réponse au format JSON
header('Content-Type: application/json');
try {
    $responsejson = json_encode($response, JSON_THROW_ON_ERROR);
    echo $responsejson;
} catch (JsonException $e) {
    $response = [
        'success' => false,
        'message' => rawurlencode('Erreur de conversion JSON: ' . $e->getMessage())
    ];
    echo json_encode($response);
}

function prepareMSSQLvarchar($str) {
    $str = trim($str);
    $str = str_replace("'", "''", $str);
    $str = utf8go_decode($str);
    return $str;
}