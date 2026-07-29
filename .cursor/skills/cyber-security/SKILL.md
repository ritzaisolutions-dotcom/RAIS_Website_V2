---
name: cyber-security
description: Use when writing, reviewing, or shipping any code on the RAIS website that touches user input, authentication, data storage, APIs, forms, or third-party integrations. Enforces secure-by-default coding practices and DSGVO-relevant data handling for an EU-facing B2B site.
---

# Cyber Security Skill — RAIS Website

## Zweck
RAIS verarbeitet Leads von Immobilienmaklern und potenziell deren Kundendaten (Interessenten, Kontaktformulare, CRM-Anbindungen). Ein Sicherheits- oder DSGVO-Fehler ist kein Detail — er ist ein Reputationsrisiko für eine Automations-Agentur, die genau diese Kompetenz verkauft.

## Nicht verhandelbare Grundregeln

1. **Keine Secrets im Code.** API-Keys, DB-Credentials, Webhook-Secrets, Tokens niemals hardcoden oder committen. Immer über Umgebungsvariablen (.env, nie ins Repo) bzw. Secret-Manager. Vor jedem Commit prüfen, ob versehentlich Keys im Diff sind.
2. **Alle Eingaben serverseitig validieren.** Client-seitige Validierung ist UX, keine Sicherheit. Jedes Formularfeld, jeder API-Parameter serverseitig auf Typ, Länge, Format prüfen — auch wenn das Frontend "schon validiert".
3. **Parametrisierte Queries, nie String-Concatenation.** SQL/NoSQL-Injections durch ORM oder parametrisierte Queries ausschließen. Kein `+`-Verketten von User-Input in Queries.
4. **Output-Encoding gegen XSS.** Keine ungefilterte Ausgabe von User-Input ins DOM (kein `dangerouslySetInnerHTML` mit rohem User-Content). Bibliotheken/Framework-Standardmechanismen zum Escaping nutzen.
5. **HTTPS überall, HSTS aktiv.** Keine gemischten Inhalte, keine Formulare die auf HTTP posten.
6. **Rate Limiting auf allen öffentlichen Formularen/APIs.** Kontaktformulare, Lead-Endpunkte, Webhooks gegen Spam/Missbrauch/Brute-Force absichern.
7. **Least Privilege.** API-Keys und DB-User nur mit den Rechten ausstatten, die sie brauchen — kein Admin-Key für einen simplen Read-Endpoint.

## DSGVO-spezifisch (Pflicht bei jedem Formular/Tracking)

- Explizite Einwilligung (Opt-in) vor jedem Tracking-Cookie oder Analytics — kein Pre-Checked-Consent.
- Datenminimierung: nur Felder abfragen, die wirklich gebraucht werden.
- Klare Datenschutzerklärung, die tatsächliche Datenflüsse widerspiegelt (welcher Anbieter, welches Land, welche Rechtsgrundlage).
- EU-Datenresidenz für Server/Subprozessoren prüfen, bevor ein neuer Dienst (Hosting, E-Mail-Versand, Analytics, CRM-Webhook) eingebunden wird.
- Löschkonzept: Lead-Daten dürfen nicht unbegrenzt gespeichert werden ohne definierten Zweck/Frist.

Für einen vollständigen Pre-Launch-Check bei RAIS-Kundenprojekten existiert der Skill `rais-ship-audit` — bei "kann das live gehen"-Fragen dorthin verweisen bzw. diesen zusätzlich nutzen.

## Vor jedem Merge/Deploy prüfen

- Läuft irgendein Secret im Client-Bundle mit (`NEXT_PUBLIC_`-Variablen mit sensiblen Werten)?
- Sind alle externen API-Calls serverseitig (nicht direkt aus dem Browser mit exponiertem Key)?
- Gibt es einen Endpunkt, der Daten ohne Auth-Check zurückgibt (IDOR-Risiko: `/api/lead/123` ohne Prüfung, ob der Anfragende Zugriff auf Lead 123 haben darf)?
- Werden Fehler-Responses so generisch gehalten, dass sie keine internen Details (Stacktraces, DB-Struktur) preisgeben?

## Rote Flaggen — sofort ansprechen, nicht stillschweigend umsetzen

- "Schnell mal ohne Auth-Check live", "Key direkt ins Frontend, sparen wir uns die Proxy-Route" — das sind Abkürzungen, die bei einem Datenleck RAIS' Glaubwürdigkeit als Automations-Anbieter zerstören.
- Neue Drittanbieter-Integration ohne Prüfung, wo die Daten liegen (EU vs. US-Server) und ob ein AVV nötig ist.
- Kritisch benennen, wenn Tempo vor Sicherheit priorisiert wird, statt es kommentarlos umzusetzen.
