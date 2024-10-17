<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bPrmIdObjetOk = false;
if (isset($_GET['idobjet'])) {
    $idObjet = $_GET['idobjet'];
    if (strlen($idObjet) < 11) {
        $pattern = '/^\d+$/';
        if (preg_match($pattern, $idObjet)) {
            $bPrmIdObjetOk = true;
        }
    }
}
if ($bPrmIdObjetOk) {
    $sSql = "cn_thing_information $idObjet";
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2($sSql);
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '{"message":"ERREUR idobjet invalide"}';
}