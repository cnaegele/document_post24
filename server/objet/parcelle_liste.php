<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = true;
$msgParamsKO = '';
if (isset($_GET['jsoncriteres'])) {
    $jsonCriteres = $_GET['jsoncriteres'];
    $oCriteres = json_decode($jsonCriteres, false);
    if (isset($oCriteres->critere)) {
        $critere = $oCriteres->critere;
    } else {
        $bParamsOk = false;
        $msgParamsKO .= ' critere manquant';
    }
    if ($bParamsOk) {
        $nombreMaximumRetour = '100';
        if (isset($oCriteres->nombremaximumretour)) {
            $nombreMaximumRetour = $oCriteres->nombremaximumretour;
            if (ctype_digit($nombreMaximumRetour) || is_int($nombreMaximumRetour)) {
                if ($nombreMaximumRetour < 0 || $nombreMaximumRetour > 999999) {
                    $nombreMaximumRetour = '100';
                }
            } else {
                $nombreMaximumRetour = '100';
            }
        }
        if (isset($oCriteres->crtype)) {
            $crType = $oCriteres->crtype;
            switch ($crType) {
                case 'numero':
                    $sSql = 'cn_parcelle_liste_parnumero';
                    break;
                case 'eca':
                    $sSql = 'cn_parcelle_liste_pareca';
                    break;
                case 'egrid':
                    $sSql = 'cn_parcelle_liste_paregrid';
                    break;
                default:
                    $bParamsOk = false;
                    $msgParamsKO .= ' crtype inconnu';
            }
        } else {
            $bParamsOk = false;
            $msgParamsKO .= ' crtype manquant';
        }
    }
} else {
    $bParamsOk = false;
    $msgParamsKO .= ' paramètres json manquant';
}
if ($bParamsOk) {
    $critere = str_replace("'", "''", $critere);
    $critere = str_replace("*", "%", $critere);
    $sSql .= " '$critere', $nombreMaximumRetour";
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "cn_parcelle_liste:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "cn_parcelle_liste:paramètres invalides' . $msgParamsKO . '"}';;
}
