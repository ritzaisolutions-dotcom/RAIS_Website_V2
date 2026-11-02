# `/akut` — offene Punkte

Ads-only Landing. Corporate-Home bleibt unangetastet. Sichtbarer Text ist LP-Copy v1.

## Steht

- H1: Kaufkräftige Anfragen — vorqualifiziert, direkt in deinen Kalender.
- CTA: Unverbindliches Gespräch buchen → `#termin`
- Cal-URL: `https://cal.com/ritzaisolutions/akut-fit-call` mit `data-cal-nolead`
- ROI nur die drei gelockten Zeilen. Kein Schieberegler, kein Return-Feld.
- Logos: `images/akut/rais-wordmark.png`, `images/akut/haller-logo.png` (schwarze Fläche)
- `noindex, follow`

## Cal-Fragen (Wortlaut am Event prüfen, kein Formular auf der Seite)

Event in der Copy: Akut Kennenlernen, 30 Minuten, Telefon. URL bleibt `akut-fit-call`.

1. Bist du Geschäftsführer / Inhaber? (Ja / Nein)
2. Teamgröße (inkl. GF)? (Zahl)
3. Welches CRM nutzt ihr? (Propstack / onOffice / Anderes / Keins)
4. Wie viele Anfragen / Tag ungefähr? (Kurztext oder Zahl)
5. Ads-Budget möglich ≥ 1.000 € / Monat auf eurem Konto? (Ja / Nein / Unklar)
6. Primärschmerz? (Zu wenig Kaufanfragen / Zu wenig Kaufmandate / Zu viel Zeit mit Filtern & Quali)

Webhook nach Notion ist Ops, nicht dieser Stand.

## VSL / Wistia (Infra steht)

- Klaro-Service `wistia`, Consent-Gate in `scripts/vsl-player.js` (Play-Klick = Einwilligung)
- Datenschutz-Absatz „Wistia erst nach Ihrer Aktion“
- CSP Report-Only: `*.wistia.com` / `*.wistia.net` in frame/script/connect/img/media
- Media-ID: `p7g2vfjbmq` → `data-vsl-src="https://fast.wistia.net/embed/iframe/p7g2vfjbmq"`

## Noch nicht

- ROI-Stufen und Return-Feld, sobald Kevin die Labels lockt. Nicht erfinden.
- Meta Pixel nicht verdrahtet
