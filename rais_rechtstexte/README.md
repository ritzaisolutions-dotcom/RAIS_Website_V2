# Installationsanleitung
## Einsatzzweck
Das eRecht24 Rechtstexte Plugin für HTML/PHP ist für Websites konzipiert, die auf keinem Content Management System (CMS) basieren, aus einem Static Site Generator generiert werden, oder auf einem CMS basieren, für das wir bislang kein passendes Plugin anbieten. Baukastensysteme für Websites werden **nicht unterstützt**, da bei diesen in der Regel die Ausführung eigener PHP-Skripte nicht möglich ist.

## Systemanforderungen
- PHP ≥ 7.4
- Unterstützte PHP-Versionen: 7.4, 8.0, 8.1, 8.2, 8.3 (empfohlen)
- Domain muss anliegen
- KEIN Passwortschutz (z. B. über htpasswd)
- von außen aufrufbar

## Schritt für Schritt
### Schritt 1
Laden Sie das eRecht24 Rechtstexte Plugin für HTML/PHP als ZIP-Datei herunter.

### Schritt 2
**Sollten Sie mit FTP oder SFTP (z. B. FileZilla, FireFTP, SmartFTP, WinSCP, ...) arbeiten, müssen Sie die ZIP-Datei auf Ihrem Computer entpacken**. Wenn Sie über die Web-FTP-Oberfläche Ihres Webhosters arbeiten oder SSH nutzen, können Sie die ZIP-Datei hochladen und auf dem Server entpacken.
  
Legen Sie den Inhalt der heruntergeladenen ZIP-Datei in neuen Ordner im Hauptverzeichnis (Root) Ihres Webspace.   
Benennen Sie den Ordner `rechtstexte` aus Sicherheitsgründen möglichst individuell um, z. B. `musterfirma-gmbh`.
Kontrollieren Sie, dass Sie die ZIP-Datei ggf. von Ihrem Webspace entfernt haben.

**Bitte beachten Sie, dass ausschließlich Buchstaben, Ziffern und die Zeichen "-" (Minus) und "_" (Unterstrich) verwendet werden dürfen.**

### Schritt 3
Öffnen Sie nun den Installationsdialog in Ihrem Browser. Diesen erreichen Sie unter der folgenden Adresse `<ihre-domain.de>/<ihr-gewählter-ordnername>/erecht24.php`. Dabei ersetzen Sie `ihre-domain.de` durch die Adresse Ihrer Webseite und `ihr-gewählter-ordnername` durch den von Ihnen im Vorschitt gewählten Ordnernamen.
[installer-1.png]

### Schritt 4
Geben Sie im geöffneten Installationsdialog Ihren eRecht24 API-Schlüssel ein. Diesen finden Sie wie folgt:
1. Rufen Sie den [eRecht24 Premium Projekt Manager](https://www.e-recht24.de/mitglieder/tools/projekt-manager/) auf.
2. Klicken Sie beim entsprechenden Projekt das **Zahnrad**-Symbol `Synchronisation` aus. Nun kann entweder ein neuer API-Schlüssel generiert werden oder der vorhandene API-Schlüssel kopiert werden.

#### Neuen API-Schlüssel anlegen
**Folgen Sie diesen Schritten, wenn bei Ihnen kein API-Schlüssel angezeigt wird.**
1. Klicken Sie auf den blauen Button `Neuen API-Schlüssel erzeugen`
2. Kopieren Sie anschließend den API-Schlüssel durch einen Klick auf den Kopieren-Button in Ihre Zwischenablage und **fahren mit Schritt 4 fort.**

#### Vorhandenen API-Schlüssel kopieren
**Folgen Sie diesen Schritten, wenn bei Ihnen bereits ein API-Schlüssel angezeigt wird.**
1. Kopieren Sie den API-Schlüssel durch einen Klick auf den Kopieren-Button in Ihre Zwischenablage.
2. Überprüfen Sie, dass unterhalb der Überschrift `Über Ihren API-Schlüssel können Sie Rechtstexte an die folgenden Websites senden` **maximal 2 Einträge erscheinen (ebenfalls in Ordnung: nur ein Eintrag oder keiner)**.
3. Sollten mehr als 2 Einträge erscheinen, löschen Sie bitte einen Eintrag über das Mülleimer-Symbol dahinter. **Bitte beachten Sie:** Nach dem Löschen können zur gelöschten Webseite keine Rechtstexte mehr automatisch übertragen werden. **Pro Projekt im eRecht24 Projekt Manager können maximal 3 verschiedene Webseiten synchronisiert werden.**
4. Fahren Sie nun mit **Schritt 4** fort.

### Schritt 5
Nun können Sie die Dateinamen für Ihre Rechtstexte auswählen. Die Endung .html wird automatisch hinzugefügt. Wir speichern Ihre Rechtstexte als HTML-Dateien auf Ihren Webspace.  
**Bitte beachten Sie, dass ausschließlich Buchstaben, Ziffern und die Zeichen "-" (Minus) und "_" (Unterstrich) verwendet werden dürfen.**
Sollten Sie keine Änderung vornehmen wollen, klicken Sie auf `weiter`.

### Schritt 6
Sie können nun bestimmen, in welchem Ordner auf Ihrem Webserver die erzeugten HTML-Dateien gespeichert werden sollen. Standardmäßig legen wir die Rechtstexte in dem Ordner ab, in den Sie die Dateien unseres eRecht24 Rechtstexte Plugins für HTML/PHP abgelegt haben. **Wichtig:** Es wird ein absoluter Serverpfad eingegeben. Wenn Sie die Dateien beispielsweise einen Ordner höher speichern wollen (also im Stammverzeichnis Ihrer Website) entfernen Sie den Ordnernamen hinter dem Schrägstrich. In unserem Beispiel wäre das `e-recht24-gmbh`. Klicken Sie anschließend auf `weiter`.

### Schritt 7
Damit Sie bequem Ihre Rechtstexte mithilfe des eRecht24 Projekt Managers aktualisieren können, wird nun ein API-Client für Ihr Projekt angelegt. Sie können nach Abschluss dieses Installationsprozesses im eRecht24 Projekt Manager bei den entsprechenden Rechtstexten auf den "synchronisieren"-Button klicken, um die Rechtstexte zu aktualisieren.

### Schritt 8
Alle von Ihnen gewählten Einstellungen werden in einer `eRecht24.json`-Datei gespeichert. Damit diese Datei nicht von außen für Dritte zugänglich ist, erhält sie einen Zufallsnamen, der immer mit `eRecht24.json` endet. **Wichtig:** Um die Einstellungen anzupassen oder den Installer erneut zu starten müssen Sie die `eRecht24.json` auf Ihrem Webspace löschen.
Klicken Sie abschließend auf `Installation abschließen`.

### Schritt 9
**Sie haben nun die Installation abgeschlossen.** Über den Button `Rechtstexte importieren` können Sie nun Ihre Rechtstexte aktualisieren. Bitte passen Sie vorher noch das Aussehen der Rechtstexte Ihrer Website an.

#### Aussehen der Rechtstexte an Website anpassen
Um das Aussehen der Rechtstexte an Ihre Website anzupassen, können Sie sogenannte Template-Dateien verwenden. 
Diese befinden sich im Ordner `/tpl` und enthalten einen Platzhalter. Dieser Platzhalter wird beim Import durch den jeweiligen Rechtstext ersetzt.
  
Für jeden Rechtstext gibt es eine eigene Template-Datei:

| Rechtstext (Sprache)                    | Name der Template-Datei |
|-----------------------------------------|-------------------------|
| Impressum (deutsche Version)            | impressum.tpl           |
| Datenschutzerklärung (deutsche Version) | datenschutz.tpl         |
| Site Notice (englische Version)         | site_notice.tpl         |
| Privacy Policy (englische Version)      | privacy.tpl             |


##### Beispiel einer Template-Datei

``` html
<!DOCTYPE html>
<html>
<head></head>
<body>
<!-- Sie können im Body HTML, CSS und JavaScript einfügen, wie Sie mögen -->

<!-- Diesen Platzhalter sollten Sie nicht entfernen. Er wird durch den entsprechenden eRecht24 Rechtstext ersetzt. -->
{{eRecht24_legal_text}}

<!-- Sie können im Body HTML, CSS und JavaScript einfügen, wie Sie mögen -->
</body>
</html>


```
##### So passen Sie die Template-Dateien an
In den Template-Dateien können Sie das Markup beliebig ändern. Sie können Ihr den HTML-Quelltext Ihrer Seite einfügen. **WICHTIG:** Entfernen Sie **nicht** den Platzhalter `{{eRecht24_legal_text}}`. Laden Sie die Template-Dateien nach der Bearbeitung wieder in den Ordner `/tpl` hoch.

**Nach dem Anpassen des Layouts müssen Sie die Rechtstexte neu synchronisieren,** damit diese in Ihrem Layout erscheinen. Gehen Sie dazu den nachfolgenden Schritt durch.

### Zukünftige Aktualisierung Ihrer Rechtstexte
Nun können Sie bequem Ihre Rechtstexte mithilfe des eRecht24 Projekt Managers aktualisieren.
Dafür gehen Sie bitte wie folgt vor:
1. Öffnen Sie den eRecht24 Projekt Manager und scrollen zum entsprechenden Projekt.
2. Sie sehen nun eine tabellarische Übersicht Ihrer Rechtstexte in diesem Projekt.
3. Klicken Sie jeweils in der Zeile zu Impressum und Datenschutz auf das Synchronisieren-Icon `Rechtstext jetzt mit Ihrer Website synchronisieren` um den jeweiligen Rechtstext zu aktualisieren.
4. Sie erhalten eine Bestätigungsmeldung. Der Text wurde nun auf Ihrer Website aktualisiert.

### Hinweis
Die HTML-Seiten mit Ihren Rechtstexten müssen von den Besucher*innen Ihrer Website gut erreichbar sein.
Wir empfehlen Ihnen, diese in Ihrer Hauptnavigation oder im Footer Ihrer Website gut erkennbar zu verlinken.

## FAQ

### Wie kann ich die Konfiguration später noch ändern?
Aus Sicherheitsgründen kann der Installationsdialog nicht noch einmal ausgeführt werden.
Falls Sie etwas an Ihrer Konfiguration ändern wollen, können Sie den Installationsprozess erneut durchlaufen.
Sehen Sie dafür *Wie kann ich den Installationsdialog erneut durchlaufen?* in unseren FAQ.

### Wie kann ich den Installationsdialog erneut durchlaufen?
1. Löschen Sie die auf `...eRecht24.json` endende Konfigurationsdatei in dem durch Sie umbenannten `rechtstexte` Ordner.
2. Starten Sie den Installationsprozess in Ihrem Browser erneut. Diesen erreichen Sie unter der folgenden Adresse `<ihre-domain.de>/<ihr-gewählter-ordnername>/eRecht24.php`. Dabei ersetzen Sie `ihre-domain.de` durch die Adresse Ihrer Webseite und `ihr-gewählter-ordnername` durch den von Ihnen gewählten Ordnernamen.

**Bitte beachten Sie, dass hierbei alle bisherigen Konfigurationen verloren gehen.**

### Warum soll ich den Ordner `rechtstexte` umbenennen?
Der Ordner `rechtstexte` sollte aus Sicherheitsgründen individuell benannt werden.

### Wie kann ich die Dateinamen der erzeugten Rechtstexte-Dateien anpassen?
In Schritt **Dateinamen** des Installationsdialogs können Sie für jeden Rechtstext und jede Sprachversion einen Dateinamen angeben. Die Endung .html wird automatisch hinzugefügt. Wir speichern Ihre Rechtstexte als HTML-Dateien auf Ihren Webspace.  
**Bitte beachten Sie, dass ausschließlich Buchstaben, Ziffern und die Zeichen "-" (Minus) und "_" (Unterstrich) verwendet werden dürfen.**

### Wie kann ich die Rechtstexte in einem anderen Verzeichnis ablegen?
Im Schritt **Speicherort** des Installationsdialogs können Sie den Pfad für ein individuelles Verzeichnis angeben, in das die Rechtstexte gespeichert werden sollen.

**Bitte beachten Sie, dass dieses Verzeichnis bereits existieren und beschreibbar sein muss. Dort vorhandene Dateien mit gleichem Dateinamen wie die Rechtstexte werden überschrieben.**

### Wie ist es möglich, dass die Rechtstexte im Layout meiner Website erscheinen?
Sie haben mit den Template-Dateien im Ordner `<ihr_gewählter_ordnername>/tpl` die Möglichkeit das HTML-Gerüst der Rechtstexte selbst vorzugeben.
Nehmen Sie hier am besten das HTML-Markup einer leeren Unterseite Ihrer Website und kopieren Sie es mit allen CSS-, Fonts- und JavaScript-Einbindungen in das Template des jeweiligen Rechtstextes.

**Bitte beachten Sie, dass der Platzhalter `{{eRecht24_legal_text}}` nicht entfernt werden darf und sich innerhalb des `<body>`-Tags befinden muss.**  
  
**Nach dem Anpassen des Layouts müssen Sie die Rechtstexte neu synchronisieren,** damit diese in Ihrem Layout erscheinen. Gehen Sie wie folgt vor:  
  
1. Öffnen Sie den eRecht24 Projekt Manager und scrollen zum entsprechenden Projekt.  
2. Sie sehen nun eine tabellarische Übersicht Ihrer Rechtstexte in diesem Projekt.  
3. Klicken Sie jeweils in der Zeile zu Impressum und Datenschutz auf das Synchronisieren-Icon `Rechtstext jetzt mit Ihrer Website synchronisieren` um den jeweiligen Rechtstext zu aktualisieren.  
4. Sie erhalten eine Bestätigungsmeldung. Der Text wurde nun auf Ihrer Website aktualisiert.

### Wie löst man das Problem "Zu viele Clients wurden für dieses Projekt angemeldet"?
Pro API-Schlüssel können nur drei Websites (sogenannte Clients) registriert werden. Wenn Sie die Maximalanzahl drei erreicht haben, müssen Sie
Clients löschen um weitere Clients registrieren zu können. Dafür gehen Sie bitte wie folgt vor:

1. Öffnen Sie den eRecht24 Projekt Manager und klicken beim entsprechenden Projekt auf das Zahnrad-Icon (Synchronisation).
2. Unter Ihrem API-Schlüssel sehen Sie nun eine tabellarische Übersicht Ihrer API-Clients.
3. Löschen Sie hier mindestens einen Client mit einem Klick auf das Mülleimer-Symbol.
4. Probieren Sie es anschließend erneut.

### Was passiert, wenn schon eine Rechtstext-Datei mit demselben Namen existiert?
Schon unter demselben Namen existente Rechtstext-Dateien werden ohne Vorwarnung überschrieben.

### Ändern sich die Adressen (URLs) meiner Rechtstexte?
Solange die Konfiguration nicht geändert wird, ändern sich auch die URLs der Rechtstexte nicht.

### Wie kann ich die Rechtstexte nach erfolgreichem Installationsprozess aus dem Projekt Manager heraus aktualisieren?
Siehe Schritt **Zukünftige Aktualisierung Ihrer Rechtstexte** der Anleitung.

### Kann ich die Rechtstexte manuell anpassen?
In den generierten Rechtstext-Dateien sollten Sie **keine manuellen Änderungen** vornehmen, da diese bei jeder Aktualisierung überschrieben werden, und Ihre Änderungen somit verloren gehen würden. Zudem sind die Rechtstexte dann nicht mehr abmahnsicher.

Sollten Sie dennoch Inhalte zusätzlich zu den eigentlichen Rechtstexten hinzufügen wollen, so können Sie diese in den Template-Dateien im Ordner `<ihr_gewählter_ordnername>/tpl` **unter- oder oberhalb des Platzhalters** `{{eRecht24_legal_text}}` hinterlegen.

### Was muss ich tun, wenn sich die Adresse meiner Website ändert (z. B. Umzug)?
Wenn sich die URL Ihrer Website ändert, müssen Sie den Installationsdialog erneut durchlaufen, damit Sie Rechstexte zwischen dem eRecht24 Projekt Manager und Ihrer Website synchronisieren können. Gehen Sie dazu wie folgt vor:  
1. Öffnen Sie den eRecht24 Projekt Manager und klicken beim entsprechenden Projekt auf das Zahnrad-Icon (Synchronisation).
2. Unter Ihrem API-Schlüssel sehen Sie nun eine tabellarische Übersicht Ihrer API-Clients.
3. Löschen Sie hier den Eintrag mit der alten Adresse Ihrer Website mit einem Klick auf das Mülleimer-Symbol.
4. Löschen Sie nun auf Ihrem Webspae per FTP die auf `...eRecht24.json` endende Konfigurationsdatei in dem durch Sie umbenannten `rechtstexte` Ordner.
5. Starten Sie den Installationsprozess in Ihrem Browser erneut. Diesen erreichen Sie unter der folgenden Adresse `<ihre-domain.de>/<ihr-gewählter-ordnername>/erecht24.php`. Dabei ersetzen Sie `ihre-domain.de` durch die Adresse Ihrer Webseite und `ihr-gewählter-ordnername` durch den von Ihnen gewählten Ordnernamen.
