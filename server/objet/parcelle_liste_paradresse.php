<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = true;
$msgParamsKO = '';
if (isset($_GET['jsoncriteres'])) {
    $jsonCriteres = $_GET['jsoncriteres'];
    $oCriteres = json_decode($jsonCriteres, false);
    if (isset($oCriteres->idadresse)) {
        $idAdresse = $oCriteres->idadresse;
        if (ctype_digit($idAdresse) || is_int($idAdresse)) {
            if ($idAdresse < 0 || $idAdresse > 9999999) {
                $bParamsOk = false;
                $msgParamsKO .= ' idadresse hors limite';
            }
        } else {
            $bParamsOk = false;
            $msgParamsKO .= ' idadresse non numérique';
        }    } else {
        $bParamsOk = false;
        $msgParamsKO .= ' idadresse manquant';
    }
    $bActif = '1';
    if (isset($oCriteres->bactif)) {
        $bActif = strval($oCriteres->bactif);
        if ($bActif != '1' && $bActif != '0') {
            $bParamsOk = false;
            $msgParamsKO .= ' bactif invalide';
        }
    }
    $bStandard = '1';
    if (isset($oCriteres->bstandard)) {
        $bStandard = strval($oCriteres->bstandard);
        if ($bStandard != '1' && $bStandard != '0') {
            $bParamsOk = false;
            $msgParamsKO .= ' bstandard invalide';
        }
    }
    $bDDP = '1';
    if (isset($oCriteres->bddp)) {
        $bDDP = strval($oCriteres->bddp);
        if ($bDDP != '1' && $bDDP != '0') {
            $bParamsOk = false;
            $msgParamsKO .= ' bddp invalide';
        }
    }
    $bPPE = '1';
    if (isset($oCriteres->bppe)) {
        $bPPE = strval($oCriteres->bppe);
        if ($bPPE != '1' && $bPPE != '0') {
            $bParamsOk = false;
            $msgParamsKO .= ' bppe invalide';
        }
    }
    $bCoPr = '1';
    if (isset($oCriteres->bcopr)) {
        $bCoPr = strval($oCriteres->bcopr);
        if ($bCoPr != '1' && $bPPE != '0') {
            $bParamsOk = false;
            $msgParamsKO .= ' bcopr invalide';
        }
    }
} else {
    $bParamsOk = false;
    $msgParamsKO .= ' paramètres json manquant';
}
if ($bParamsOk) {
    $sSql = "cn_parcelle_liste_paradresse $idAdresse, $bActif, $bStandard, $bDDP, $bPPE, $bCoPr";
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "parcelle_liste_paradresse:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "parcelle_liste_paradresse:paramètres invalides' . $msgParamsKO . '"}';;
}
