<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bPrmIdAffaire = false;
if (isset($_GET['idaffaire'])) {
    $idAffaire = $_GET['idaffaire'];
    if (strlen($idAffaire) <= 8) {
        $pattern = '/^\d+$/';
        if (preg_match($pattern, $idAffaire)) {
            $bPrmIdAffaire = true;
        }
    }
}
if ($bPrmIdAffaire) {
    $sSql = "cn_affaire_infolight_parid $idAffaire";
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2($sSql);
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '{"message":"ERREUR idaffaire invalide"}';
}