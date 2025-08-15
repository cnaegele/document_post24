<?php
require_once 'gdt/cldbgoeland.php';
require 'gdt/gautentificationf5.php';
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
$idCaller = 0;
if (array_key_exists('empid', $_SESSION)) {
    $idCaller = $_SESSION['empid'];
}

if ($bPrmIdActeurOk) {
    $sSql = "cn_acteur_datarole $idActeur, $idCaller";
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
