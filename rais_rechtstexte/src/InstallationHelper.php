<?php
declare(strict_types=1);

namespace ERecht24;

use ERecht24\Model\Client;
use ERecht24\Service\ClientCreateService;
use ERecht24\Service\ClientListService;

final class InstallationHelper
{
    const ERECHT24_VERSION_NUMBER = '1.0.4';

    public function __construct(
        ?string $method
    ) {
        if (!$method)
            return $this->sendError("Keine Methode angegeben");

        if (!method_exists($this,$method))
            return $this->sendError("Ungültige Methode angegeben");

        foreach ($_POST as $key => $value)
            if (strlen($value) > 250)
                return $this->sendError(sprintf('Der angegebende Wert für den Parameter %s ist zu lang. Es sind maximal 100 Zeichen zulässig.', $key));

        return $this->{$method}();
    }

    private function checkApiKey()
    {
        $api_key = $_POST['api_key'];
        if (!$api_key || !is_string($api_key))
            return $this->sendError('Fehlerhafter API Key. Bitte überprüfen Sie Ihre Eingabe und versuchen es erneut.');

        $apiClient = new ApiClient($api_key);
        $service = new ClientListService($apiClient);
        $service->execute();

        if (!$service->getResponse()->isSuccess())
            return $this->sendError('Fehlerhafter API-Schlüssel. Bitte überprüfen Sie Ihre Eingabe und prüfen Sie im eRecht24 Projekt Manager, dass der API-Schlüssel übereinstimmt und versuchen es erneut.');

        return $this->sendSuccess('Gültiger API Key.');
    }

    private function checkMapping()
    {
        $requiredFields = [
            'impressum',
            'datenschutz',
        ];

        $optionalFields = [
            'privacy',
            'site_notice',
        ];

        foreach ($requiredFields as $field) {
            if (!array_key_exists($field, $_POST))
                return $this->sendError(sprintf('Der notwendige Parameter %s fehlt. Bitte überprüfen Sie Ihre Eingabe.', $field));

            $value = strval($_POST[$field]);
            if (!$value)
                return $this->sendError(sprintf('Das notwendige Feld %s hat keinen Wert. Bitte überprüfen Sie Ihre Eingabe.', $field));

            if (!preg_match('/^[a-z_\-\d]+$/i', $value))
                return $this->sendError(sprintf('Das notwendige Feld %s enthält ungültige Zeichen. Bitte nutzen Sie ausschließlich Buchstaben, Zahlen oder die Zeichen - _ . Bitte überprüfen Sie Ihre Eingabe.', $field));
        }

        foreach ($optionalFields as $field) {
            if (!array_key_exists($field, $_POST))
                continue;

            $value = strval($_POST[$field]);
            if (!$value)
                continue;

            if (!preg_match('/^[a-z_\-\d]+$/i', $value))
                return $this->sendError(sprintf('Das optionale Feld %s enthält ungültige Zeichen. Bitte nutzen Sie ausschließlich Buchstaben, Zahlen oder die Zeichen - _ . Bitte überprüfen Sie Ihre Eingabe.', $field));
        }

        return $this->sendSuccess('Gültiges Mapping.');
    }

    private function checkDirectory() {
        if (!array_key_exists('path', $_POST))
            return $this->sendError('Notwendiger Parameter path wurde nicht übertragen. Bitte überprüfen Sie Ihre Eingaben.');

        $value = strval($_POST['path']);
        if (!$value)
            return $this->sendError(sprintf('Das notwendige Feld %s hat keinen Wert. Bitte überprüfen Sie Ihre Eingabe.', 'path'));

        if (!is_dir($value))
            return $this->sendError('Das angegebene Verzeichnis existiert nicht.');

        if(!is_writable($value))
            return $this->sendError('Im angegebenen Verzeichnis können keine Dateien geschrieben werden. Bitte passen Sie die Berechtigung an oder wählen ein anderen Ordner.');

        return $this->sendSuccess('Gültiger Path');
    }

    private function registerClient()
    {
        $apiKey = strval($_POST['api_key']);
        $push_uri = $_POST['setup_url_protocol'] . '//' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        if (!$apiKey)
            return $this->sendError('Kein API Key angegeben. Bitte überprüfen Sie Step 1.');

        if (filter_var($push_uri, FILTER_VALIDATE_URL) === false)
            return $this->sendError("Bei der Einrichtung des Clients ist ein Fehler aufgetreten. Die URL $push_uri konnte nicht validiert werden. Fehlercode: 1744622273");

        $apiClient = new ApiClient($apiKey);
        $data = new Client([
            'push_method' => 'GET',
            'push_uri' => $push_uri,
            'cms' => 'php',
            'cms_version' => self::ERECHT24_VERSION_NUMBER,
            'plugin_name' => 'eRecht24_html_generator',
            'author_mail' => 'api@e-recht24.de',
        ]);

        // execute service
        $service = new ClientCreateService($apiClient, $data);
        $service->execute();

        if (!$service->getResponse()->isSuccess()) {
            $errorMessageAppend = ' Bitte öffnen Sie den eRecht24 Projekt Manager und klicken beim entsprechenden Projekt auf das Zahnrad-Icon (Synchronisation). Unter Ihrem API-Schlüssel sehen Sie nun eine tabellarische Übersicht Ihrer API-Clients. Löschen Sie hier mindestens einen Client mit einem Klick auf das Mülleimer-Symbol. Probieren Sie es anschließend erneut.';
            return $this->sendError($service->getResponse()->getBodyDataByKey('message_de') ?? 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.') . $errorMessageAppend;
        }

        $erecht24_secret = $service->getResponse()->getBodyDataByKey('secret');
        if (!$erecht24_secret)
            return $this->sendError('Das API Secret konnte nicht ermittelt werden. Bitte versuchen Sie es später erneut.');

        $client_id = $service->getResponse()->getBodyDataByKey('client_id');
        if (!$client_id)
            return $this->sendError('Die Client ID konnte nicht ermittelt werden. Bitte versuchen Sie es später erneut.');

        return $this->sendSuccess('Client registriert', ['erecht24_secret' => $erecht24_secret, 'client_id' => $client_id]);
    }

    private function finishInstallation()
    {
        $requiredFields = [
            'impressum',
            'datenschutz',
            'api_key',
            'erecht24_secret',
            'client_id',
            'path',
        ];

        $optionalfields = [
            'site_notice',
            'privacy',
        ];

        $data = [];
        foreach ($requiredFields as $field) {
            if (!array_key_exists($field, $_POST))
                return $this->sendError(sprintf('Der notwendige Parameter %s fehlt. Bitte wiederholen Sie die Installation.', $field));

            $value = strval($_POST[$field]);

            if (!$value)
                return $this->sendError(sprintf('Das notwendige Feld %s hat keinen Wert. Bitte wiederholen Sie alle Installationsschritte.', $field));

            $data[$field] = $value;
        }

        foreach ($optionalfields as $field) {
            $data[$field] = strval($_POST[$field] ?? '');
        }

        try {
            $configFile = ($files = glob("*.eRecht24.json"))
                ? $files[0]
                : bin2hex(random_bytes(16)) . '.eRecht24.json';

            $fp = fopen($configFile, 'w');
            fwrite($fp, json_encode($data));
            fclose($fp);
        } catch (Exception $exception) {
            return $this->sendError('Die Konfigurationsdatei konnte nicht gespeichert werden. Bitte kontaktieren Sie den Serveradministrator.');
        }

        return $this->sendSuccess('Konfiguration erfolgreich getestet & gespeichert.');
    }

    private function sendError(
        string $msg
    ) {
        echo json_encode([
            "status" => 500,
            "message" => $msg,
        ]);
    }

    private function sendSuccess(
        string $msg,
        array $data = []
    ) {
        echo json_encode([
            "status" => 200,
            "message" => $msg,
            "data" => $data
        ]);
    }
}
