<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = false;
if (isset($_GET['idacteur'])) {
    $idActeur = $_GET['idacteur'];
    if (strlen($idActeur) < 11) {
        $pattern = '/^\d+$/';
        if (preg_match($pattern, $idActeur)) {
            $bPrmIdActeurOk = true;
        }
    }
}
if (isset($_GET['idemploye'])) {
    $idEmploye = $_GET['idemploye'];
} else {
    $idEmploye = '0';
}
$pattern = '/^\d+$/';
if (strlen($idActeur) > 10 || !preg_match($pattern, $idEmploye)) {
    $bPrmIdActeurOk = false;
}

if ($bPrmIdActeurOk) {
    $sSql = "cn_acteur_datarole $idActeur, $idEmploye";
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "acteur_datarole:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "acteur_datarole:param&egrave;tre idacteur invalide"}';
}
