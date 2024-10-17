<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bPrmMD5 = false;
if (isset($_GET['md5'])) {
    $strMD5 = $_GET['md5'];
    if (strlen($strMD5) == 32) {
        $pattern = '/^\w+$/';
        if (preg_match($pattern, $strMD5)) {
            $bPrmMD5 = true;
        }
    }
}
if ($bPrmMD5) {
    $sSql = "cn_document_liste_parmd5 '$strMD5'";
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2($sSql);
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '{"message":"ERREUR MD5 invalide"}';
}