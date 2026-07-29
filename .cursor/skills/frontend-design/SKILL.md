---
name: frontend-design
description: Use when building or reviewing any UI/frontend work on the RAIS website — components, layouts, pages, styling, responsiveness, or accessibility. Enforces a consistent, professional, conversion-focused design system for a B2B SaaS site targeting Immobilienmakler (real estate agents).
---

# Frontend Design Skill — RAIS Website

## Zweck
Jede UI-Entscheidung auf der RAIS-Website muss zwei Dingen dienen: Vertrauen bei Immobilienmaklern aufbauen und zur Conversion (Termin/Demo buchen) führen. Kein Feature-Design um des Designs willen.

## Design-Prinzipien (Reihenfolge = Priorität)

1. **Klarheit vor Kreativität.** Der Besucher muss in 5 Sekunden verstehen: Was macht RAIS, für wen, welcher Nutzen. Keine vagen Buzzwords ohne konkrete Aussage.
2. **Ein klarer CTA pro Screen.** Primärer CTA (z.B. "Demo buchen") visuell dominant, ein einziger Stil dafür konsistent über die ganze Seite. Sekundäre Aktionen klar untergeordnet.
3. **Mobile-first.** Makler checken Websites oft am Handy zwischen Terminen. Layout, Touch-Targets (min. 44px), Ladezeit zuerst für Mobile denken, dann hochskalieren.
4. **Performance ist Design.** Lighthouse Score im Kopf behalten: keine ungenutzten großen Libraries, Bilder komprimiert/lazy-loaded, keine Layout-Shifts (CLS).
5. **Konsistenz über Vielfalt.** Ein Farbsystem, eine Typo-Skala, ein Spacing-System (z.B. 4/8px-Raster). Neue Komponenten wiederverwenden bestehende Tokens statt neue zu erfinden.

## Technischer Rahmen

- Tailwind CSS als Standard-Styling-Ansatz, sofern das Projekt nichts anderes vorgibt — vor dem Schreiben von Custom-CSS immer prüfen, ob eine Utility-Klasse ausreicht.
- Komponentenbasiert (React/Next.js typtypisch für RAIS-Projekte): jede wiederkehrende UI-Einheit (Card, Button, Testimonial, FAQ-Item) als eigene Komponente, keine Copy-Paste-Blöcke.
- Barrierefreiheit ist Pflicht, kein Nice-to-have: semantisches HTML, ausreichende Kontraste (WCAG AA, min. 4.5:1 für Fließtext), Alt-Texte, Tastaturbedienbarkeit, sichtbarer Fokus-Zustand.
- Responsive Breakpoints testen: 375px (Mobile), 768px (Tablet), 1280px+ (Desktop) — nie nur am großen Monitor entwerfen.

## Vor jeder Component-/Page-Erstellung prüfen

- Gibt es bereits eine ähnliche Komponente im Projekt? → wiederverwenden/erweitern statt duplizieren.
- Ist der CTA eindeutig und der Text handlungsorientiert ("Kostenloses Erstgespräch buchen" statt "Mehr erfahren")?
- Funktioniert die Komponente ohne JavaScript-Fehler bei fehlenden/leeren Daten (Empty States)?
- Ladezustände (Skeletons/Spinner) für alles, was Daten nachlädt?

## Rote Flaggen — sofort ansprechen, nicht schweigend umsetzen

- Trend-verliebtes Design (z.B. exzessive Animationen, Glassmorphism ohne Zweck), das Ladezeit oder Klarheit kostet.
- Mehr als ein visuell gleichrangiger CTA pro Fold.
- Neue Farbe/Font/Spacing-Wert, der nicht ins bestehende System passt.
- Stock-Foto-Ästhetik, die generisch wirkt statt Vertrauen für Makler-Zielgruppe aufzubauen.

Wenn eine Design-Anforderung von Kevin diesen Prinzipien widerspricht (z.B. "mach mal 5 CTAs auf die Startseite"), das kritisch benennen statt stillschweigend umzusetzen.
