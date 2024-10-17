<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bPrmIdEmployeOk = false;
if (isset($_GET['idemploye'])) {
    $idEmploye = $_GET['idemploye'];
    if (strlen($idEmploye) < 11) {
        $pattern = '/^\d+$/';
        if (preg_match($pattern, $idEmploye)) {
            $bPrmIdEmployeOk = true;
        }
    }
}
if ($bPrmIdEmployeOk) {
    $sSql = "cn_employe_information $idEmploye";
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2($sSql);
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '{"message":"ERREUR idemploye invalide"}';
}