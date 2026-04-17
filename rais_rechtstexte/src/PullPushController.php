<?php
declare(strict_types=1);

namespace ERecht24;

use ERecht24\Interfaces\ServiceInterface;
use ERecht24\Service\ImprintGetService;
use ERecht24\Service\PrivacyPolicyGetService;
use ERecht24\Service\PrivacyPolicySocialMediaGetService;
use Throwable;

final class PullPushController
{
    const DEFAULT_NAMES = [
        'impressum',
        'datenschutz',
        'privacy',
        'site_notice',
    ];

    const ALLOWED_PUSH_TYPES = [
        'ping',
        'imprint',
        'privacyPolicy',
        'privacyPolicySocialMedia',
        'all'
    ];

    private $config;
    private $configFile;

    public function __construct(
        $configFile
    ) {

        $this->configFile = $configFile;
        $this->log("[IMPORT GESTARTET]");

        if(!$this->validate()) {
            $this->log("[IMPORT FEHLGESCHLAGEN]");
            exit;
        }

        try {
            $apiClient = new ApiClient($this->getConfig()['api_key']);
            switch ($_GET['erecht24_type']) {
                case 'ping':
                    echo json_encode(['code' => 200, 'message' => 'pong']);
                    return;
                case 'imprint':
                    $this->importSiteNotice($apiClient);
                    break;
                case 'privacyPolicy':
                case 'privacyPolicySocialMedia':
                    $this->importPrivacyPolicy($apiClient);
                    break;
                case 'all':
                    $this->importSiteNotice($apiClient);
                    $this->importPrivacyPolicy($apiClient);
            }
        } catch (Throwable $e) {
            header("HTTP/1.1 500 Server Error");
            header('Content-Type: application/json');
            die(json_encode(['status' => 500, 'message' => $e->getMessage(), 'code' => $e->getCode(), 'file' => $e->getFile()]));
        }

        header('Content-Type: application/json');
        echo json_encode(['status' => 200, 'message' => 'Dokumente erfolgreich importiert']);
    }

    private function importSiteNotice($apiClient) {
        $service = new ImprintGetService($apiClient);
        $en_key = 'site_notice';
        $de_key = 'impressum';
        $result = $this->importLegalText($service, $en_key, $de_key);

        if ($result) {
            $this->log("Abruf erfolgreich $de_key & $en_key");
            try {
                $this->writeToFile($de_key, $result->html_de);
                $this->writeToFile($en_key, $result->html_en);
            }
            catch (Throwable $e) {
                throw $e;
            }
        }

        $this->log("[IMPORT BEENDET] importiert wurden $de_key & $en_key");
    }

    private function  importPrivacyPolicy($apiClient) {
        $service = new PrivacyPolicyGetService($apiClient);
        $en_key = 'privacy';
        $de_key = 'datenschutz';
        $result = $this->importLegalText($service, $en_key, $de_key);
        $en_key_social_media = 'privacy_social_media';
        $de_key_social_media = 'datenschutz_social_media';
        $service = new PrivacyPolicySocialMediaGetService($apiClient);
        $socialMediaResult = $this->importLegalText($service, 'privacy_social_media', 'datenschutz_social_media');

        if ($result || $socialMediaResult) {
            $this->log("Abruf erfolgreich $de_key & $en_key");
            $this->log("Abruf erfolgreich $de_key_social_media & $en_key_social_media");
            try {
                $de = sprintf('%s %s', ($result)? $result->html_de : '', ($socialMediaResult)? $socialMediaResult->html_de : '');
                $this->writeToFile($de_key, $de);

                $en = sprintf('%s %s', ($result)? $result->html_en : '', ($socialMediaResult)? $socialMediaResult->html_en : '');
                $this->writeToFile($en_key, $en);
            }
            catch (Throwable $e) {
                throw $e;
            }
        }

        $this->log("[IMPORT BEENDET] importiert wurden $de_key & $en_key");
    }

    /**
     * @throws Exception
     */
    private function importLegalText(
        ServiceInterface $service,
        string $en_key,
        string $de_key
    ) {
        $this->log("[IMPORT GESTARTET] importiere $de_key & $en_key");

        try {
            $result = $service->execute()->getLegalText();
        }
        catch (Throwable $e) {
            $this->log("Fehler: Abruf von $de_key & $en_key war fehlerhaft");
            throw $e;
        }

        return $result;
    }

    /**
     * @throws Exception
     */
    private function writeToFile($name, $text)
    {

        if(empty($text)) {
            $this->log("[UEBERSPRUNGEN]: API-Ergebnis für $name ist leer.");
            return;
        }

        $text = trim($text);

        if(!$this->getConfig()[$name]) {
            $this->log("[UEBERSPRUNGEN]: Es existiert kein Name für die Html Datei: $name.");
            return;
        }

        $template = "tpl/$name.tpl";
        if (!file_exists($template)) {
            try {
                touch($template);
                file_put_contents($template, '{{eRecht24_legal_text}}');
            }
            catch (Throwable $e) {
                $this->log("Fehler: Template-Datei tpl/$name.tpl konnte nicht angelegt werden.");
                throw $e;
            }
        }

        $html = str_replace("{{eRecht24_legal_text}}", $text, file_get_contents($template));
        $filename = (substr($this->getConfig()['path'], -1) === '/')
            ? $this->getConfig()['path'] . $this->getConfig()[$name] . '.html'
            : $this->getConfig()['path'] . '/' . $this->getConfig()[$name] . '.html';

        try {
            touch($filename);
            file_put_contents($filename, $html);
        }
        catch (Throwable $e) {
            $this->log("Fehler: HTML-Datei $filename konnte nicht erstellt werden.");
            throw $e;
        }
    }

    private function validate(): bool
    {
        $secret = (array_key_exists('erecht24_secret', $_GET))
            ? $_GET['erecht24_secret']
            : null;

        if (!$secret) {
            header("HTTP/1.1 401 Unauthorized");
            $this->log('[FEHLER] Unautorisierter Zugriff. API-Secret wurde nicht angegeben.');
            return false;
        }

        if(!array_key_exists('erecht24_type', $_GET) || !in_array($_GET['erecht24_type'], self::ALLOWED_PUSH_TYPES)) {
            header("HTTP/1.1 400 Unknown type");
            $this->log('[FEHLER] Request gescheitert. Falscher Typ spezifiziert.');
            return false;
        }

        try {
            $config = $this->getConfig();
        } catch (Throwable $e) {
            header("HTTP/1.1 500 Server Error");
            $this->log('[FEHLER] Konfiguration konnte nicht ausgelesen werden.');
            return false;
        }

        if(!array_key_exists('erecht24_secret', $config) || !$config['erecht24_secret']) {
            header("HTTP/1.1 500 Server Error");
            $this->log('[FEHLER] API-Secret konnte nicht gelesen werden.');
            return false;
        }

        if($config['erecht24_secret'] !== $secret) {
            header("HTTP/1.1 401 Unauthorized");
            $this->log('[FEHLER] API-Secrets stimmen nicht überein. ABBRUCH.');
            return false;
        }

        if(!array_key_exists('api_key', $config) || !$config['api_key']) {
            header("HTTP/1.1 500 Server Error");
            $this->log('[Fehler] API-Key kann nicht gelesen werden.');
            return false;
        }

        if(!array_key_exists('path', $config) || !$config['path']) {
            $this->config['path'] = dirname( dirname(__FILE__) );
        }

        foreach (self::DEFAULT_NAMES as $name) {
            $this->config[$name] = (array_key_exists($name, $config) && $config[$name] && preg_match('/^[a-z_\-\d]+$/i', $config[$name]))
                ? $config[$name]
                : $name;
        }

        return true;
    }

    /**
     * @throws Exception
     */
    private function getConfig()
    {
        if (is_null($this->config)) {
            $this->config = json_decode(file_get_contents($this->configFile), true);
        }

        if (!is_array($this->config))
            throw new Exception('Invalid Config. Array Expected.');

        return $this->config;
    }

    private function log($message)
    {
        $datetime = date("d.m.Y H:i:s");

        $logEntry = "$datetime: $message\n";

        $logFile = ($files = glob("*.eRecht24.log"))
            ? $files[0]
            : bin2hex(random_bytes(16)) . '.eRecht24.log';

        touch($logFile);
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
}
