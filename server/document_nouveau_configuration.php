<?php
//require 'gdt/gautentificationf5.php';
require_once 'gdt/cldbgoeland.php';
require_once '/data/dataweb/GoelandWeb/webservice/employe/clCNWSEmployeSecurite.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:  OPTIONS, GET");
header('Content-Type: application/json; charset=utf-8');
$codeConfig = 'defaut';
if (isset($_GET['codeconfig'])) {
    $codeConfig = $_GET['codeconfig'];
}
switch ($codeConfig) {
    case 'generic':
        //Réservé au groupe GoelandManager
        //$idCaller = 6;
        $idCaller = 0;
        if (array_key_exists('empid', $_SESSION)) {
            $idCaller = $_SESSION['empid'];
        }
        $jsonPropsInit = '{}';
        if ($idCaller > 0) {
            $pseudoWSEmployeSecurite = new CNWSEmployeSecurite();
            if ($pseudoWSEmployeSecurite->isInGroupe($idCaller, 'GoelandManager')) {
                $dbgo = new DBGoeland();

                $sSql = "cn_docfamily_liste_docpostgeneric";
                $dbgo->queryRetJson2($sSql);
                $jsonFamillesDoc = $dbgo->resString;

                $sSql = "cn_typedocument_liste_docpostgeneric";
                $dbgo->queryRetJson2($sSql);
                $jsonTypesDoc = $dbgo->resString;

                unset($dbgo);

                $jsonFamillesTypesDoc = '';
                $oFamilles = json_decode($jsonFamillesDoc);
                foreach ($oFamilles as $oFamille) {
                    $jsonFamille = json_encode($oFamille);
                    $jsonFamille = str_replace('}', ', "type":' . $jsonTypesDoc . '}', $jsonFamille);
                    if ($jsonFamillesTypesDoc != '') {
                        $jsonFamillesTypesDoc .= ',';
                    }
                    $jsonFamillesTypesDoc .= $jsonFamille;
                }
                $jsonPropsInit = '{"libelle":"indexation générique d\'un document (réservé au groupe GoelandManager)"';
                $jsonPropsInit .= ',"sizemax":209715200';
                $jsonPropsInit .= ',"famillestypes":[' . $jsonFamillesTypesDoc . ']}';
            }
        }
        echo $jsonPropsInit;
        break;
    default:
        $path = '/data/dataweb/GoelandWeb/goeland/document/nouveau/json/';
        $filejsonname = "$codeConfig.json";
        if (file_exists($path . $filejsonname)) {
            echo file_get_contents($path . $filejsonname);
        } else {
            echo '{}';
        }
}

