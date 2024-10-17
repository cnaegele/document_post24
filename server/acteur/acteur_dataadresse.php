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
if ($bPrmIdActeurOk) {
    $sSql = "cn_acteur_dataadresse $idActeur";
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "acteur_dataadresse:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "acteur_dataadresse:param&egrave;tre idacteur invalide"}';
}
