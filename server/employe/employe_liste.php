<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = true;
if (isset($_GET['jsoncriteres'])) {
    $jsonCriteres = $_GET['jsoncriteres'];
    $oCriteres = json_decode($jsonCriteres, false);
    $idUniteOrg = '0';
    if (isset($oCriteres->iduniteorg)) {
        $idUniteOrg = $oCriteres->iduniteorg;
    }
    $critere = '';
    if (isset($oCriteres->critere)) {
        $critere = $oCriteres->critere;
        $critere = str_replace("'", "''", $critere);
    }
    if ($idUniteOrg === '0' && $critere ==='') {
        $bParamsOk = false;
    }
    if (isset($oCriteres->bemployedesactive)) {
        $bemployedesactive = $oCriteres->bemployedesactive;
    } else {
        $bemployedesactive = '0';
    }
    if ($bemployedesactive === '0') {
        //on ne veut pas les désactivé
        $critBactif = '1';
    } else {
        //on veut aussi les désactivé
        $critBactif = '2';
    }
    $nombreMaximumRetour = '';
    if (isset($oCriteres->nombremaximumretour)) {
        $nombreMaximumRetour = $oCriteres->nombremaximumretour;
    }
} else {
    $bParamsOk = false;
}
if ($bParamsOk) {
    $sSql = "cn_employe_liste '$critere', $critBactif, $idUniteOrg";
    if ($nombreMaximumRetour != '') {
        $sSql .= ", $nombreMaximumRetour";
    }
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "employe_liste:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "acteur_liste:param&egraves invalides"}';;
}
