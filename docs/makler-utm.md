# Makler Landingpage — UTM-Schema

Seite: `/makler.html`  
Kennzahl: `booking_confirmed / lp_view`  
Events feuern lokal (`rais:makler` + `console.debug`), werden nicht gespeichert.

## Pflichtparameter pro Reel

Jedes Reel bekommt eine eigene `utm_source`. Ohne das sind die zwölf Clips nach dem Ausrollen nicht trennbar.

| Parameter | Wert | Beispiel |
|-----------|------|----------|
| `utm_source` | Reel-ID | `ig_reel_01` … `ig_reel_12` |
| `utm_medium` | Kanal | `instagram` oder `tiktok` |
| `utm_campaign` | Kampagne | `makler_shortform_2026` |

## Link-Muster

```
https://ritz-ai.solutions/makler.html?utm_source=ig_reel_01&utm_medium=instagram&utm_campaign=makler_shortform_2026
```

## Reel-Register (ausfüllen beim Ausrollen)

| Reel | Hook / Wortlaut | utm_source | H1 auf der Seite angepasst? | Live ab |
|------|-----------------|------------|-----------------------------|---------|
| 01 | | `ig_reel_01` | | |
| 02 | | `ig_reel_02` | | |
| 03 | | `ig_reel_03` | | |
| 04 | | `ig_reel_04` | | |
| 05 | | `ig_reel_05` | | |
| 06 | | `ig_reel_06` | | |
| 07 | | `ig_reel_07` | | |
| 08 | | `ig_reel_08` | | |
| 09 | | `ig_reel_09` | | |
| 10 | | `ig_reel_10` | | |
| 11 | | `ig_reel_11` | | |
| 12 | | `ig_reel_12` | | |

## Events

| Ereignis | Auslöser |
|----------|----------|
| `lp_view` | Seitenaufruf, inkl. UTM aus der Query |
| `sim_start` | Simulation manuell gestartet (Button-Klick) |
| `calc_complete` | Slider mindestens einmal bewegt |
| `booking_confirmed` | Cal.com `bookingSuccessful` |

## Deploy-Checkliste

- [ ] H1 an den tatsächlichen Reel-Wortlaut angepasst
- [ ] Kein Navigationslink, der von der Seite wegführt, ausser Impressum und Datenschutz
- [ ] Buchung inline, kein Tab-Wechsel
- [ ] Rechner-CTA ohne Scroll erreichbar
- [ ] Reel-Fragment eingebunden (oder Foto-Fallback bewusst belassen)
- [ ] Sticky CTA mobil
- [ ] `prefers-reduced-motion` respektiert
- [ ] Vier Tracking-Ereignisse feuern (DevTools / `rais:makler`)
- [ ] UTM-Parameter pro Reel dokumentiert
- [ ] Seite lädt unter zwei Sekunden auf 4G
