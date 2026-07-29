# Kevin-Gate Kern (Home + AQuT)

Kurzes Review vor dem Live-Deploy des Multipage-Kerns. Skills: `.cursor/skills/frontend-design`, `.cursor/skills/cyber-security`.

## Home (`/`)

- [ ] In 5 Sekunden klar: **RAIS** für Makler, nicht AQuT als Marke
- [ ] Ein primärer CTA: Audit buchen; sekundär nur ruhiger Link zu `#systeme`
- [ ] Trust-Strip ohne Tracker/Tool-Logos
- [ ] Haller-Teaser ohne erfundene Kennzahlen; Link nach `/referenzen.html`
- [ ] Bento: AQuT dominant, 5 Peers leichter + Kontextwort (Makler / Intern / Content)
- [ ] Kein 60-Std-Claim; 30 Std nur als Orientierung mit Volumen/Herleitung
- [ ] Kein Collab-Pfad, kein Rechner, keine Videos auf Home
- [ ] Mobile 375: Hamburger + Audit-CTA bedienbar (nach Klaro)

## AQuT (`/aqut.html`)

- [ ] Label „System von RAIS“; Absender bleibt RAIS
- [ ] Claim-Formel: ~30 Std/Monat, abhängig vom Volumen, Herleitung 5 bis 8 Std/Woche
- [ ] Rechner klar als „Ihre Rechnung“; Ergebnis darf vom Claim abweichen ohne Widerspruch
- [ ] Rechner: keine Kontaktdaten, kein Submit, keine Netzwerk-Calls
- [ ] Ein CTA Audit; 4 Schritte, Paket 1, Sage-Accordion, Paket-2-Ausblick, Scope

## Security / DSGVO (Kern)

- [ ] Keine Secrets im Client-Bundle
- [ ] Lead nur über bestehendes Booking-Modal → Edge Function
- [ ] Kein YouTube/`ytimg` vor Consent auf Kernseiten

## Nach OK

1. Lead-Abnahme laut [`audit-lead-security-deploy.md`](./audit-lead-security-deploy.md)
2. Site-Build/Deploy der Multipage-Seiten
3. Erst dann Feinschliff an Nebenpfaden, falls nötig
