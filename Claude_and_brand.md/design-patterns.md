# RAIS Design-Patterns

Stand 05.08.2026. Copy-Paste-Bausteine für das visuelle System. Ergänzt `brand.md` (was gilt) und `brand_steer.md` (warum) um die Frage **wie**.

Das CSS liegt als Pattern-Bibliothek am Ende von `styles/site-multipage.css`. Diese Datei lädt jede Seite, die Muster funktionieren also überall. Alles hier ist Vanilla HTML und CSS, keine Dependency, kein Build-Schritt.

**Vor dem Einsetzen einmal lesen:** [Fallstricke](#fallstricke) am Ende. Zwei der Muster sind an Bedingungen geknüpft, die man nicht sieht.

---

## 1. Grüne Leitfläche

Die tragende dunkle Fläche. **Höchstens drei pro Seite.** Helle Bänder sind der Kontext draußen, grüne Flächen sind „innerhalb der Grenze".

```html
<section id="beispiel" class="home-band surface-green" aria-labelledby="beispiel-title">
  <div class="section-wrap">
    <span class="mono-label">Eyebrow</span>
    <h2 class="section-h2" id="beispiel-title">Die Überschrift.</h2>
    <p class="section-sub">Ein Satz, der die Überschrift trägt.</p>
  </div>
</section>
```

Bringt automatisch mit: Höhenlinien im Untergrund, Linen-Text, Salbei-Labels, Salbei-Links, sichtbaren Fokusring. Nichts davon muss einzeln gesetzt werden.

`.surface-green` ist der Name für neue Sektionen. `.home-band--green` ist derselbe Baustein unter dem alten Namen und bleibt gültig, damit bestehendes Markup nicht bricht.

**Nicht kombinieren mit** `.home-band--cloud` oder `.home-band--linen`, das sind die hellen Gegenstücke.

---

## 2. Höhenlinien als Untergrund

Die Signature. Auf `.surface-green` liegt sie schon drauf. Für alles andere:

```html
<div class="topo-lines" style="position: relative; isolation: isolate;">
  <!-- Inhalt -->
</div>
```

Stärke regeln, Standard ist `0.15`:

```html
<!-- kräftiger, wo ein Foto konkurriert (so steht der Hero) -->
<div class="topo-lines" style="--topo-opacity: 0.3;">
```

**Bedingung:** Das Element braucht `position: relative` **und** `isolation: isolate`. Die Linien liegen auf `z-index: -1`; ohne den eigenen Stapelkontext fallen sie hinter den Hintergrund und sind unsichtbar.

**Wann nicht:** Nicht auf helle Flächen legen. Die Linien sind in `--sage-light` gezeichnet und wirken auf Cloud wie ein Druckfehler. Und nicht auf mehr als zwei bis drei Flächen pro Seite, sonst wird aus der Signature ein Muster.

---

## 3. Karte auf grünem Grund

Kein Schatten. Auf dunklem Grund ist er unsichtbar und nur Ballast. Tiefe kommt aus Füllung plus Haarlinie.

```html
<div class="card-green">
  <span class="card-green__label">Ihre Systeme</span>
  <ul>
    <li>CRM</li>
    <li>Postfach</li>
  </ul>
</div>
```

Den einen Knoten anheben, der die Aussage trägt:

```html
<div class="card-green card-green--lead">
  <span class="card-green__label">RAIS-Schicht</span>
  <ul>
    <li>Hosting in der EU</li>
    <li>AVV nach Art. 28</li>
  </ul>
</div>
```

**`--lead` genau einmal pro Gruppe.** Werden zwei angehoben, hebt sich nichts mehr ab.

---

## 4. Endlosschleife

Für Inhalte, die tatsächlich breiter sind als der Container. Nachbau von `InfiniteSlider` (21st.dev), dort React mit framer-motion, hier reines CSS.

```html
<div class="marquee" style="--marquee-duration: 31.5s">
  <div class="marquee__track">
    <ul class="meine-liste">
      <li>Eins</li><li>Zwei</li><li>Drei</li>
    </ul>
    <!-- exakte Kopie, aria-hidden, sonst liest ein Screenreader alles doppelt -->
    <ul class="meine-liste" aria-hidden="true">
      <li>Eins</li><li>Zwei</li><li>Drei</li>
    </ul>
  </div>
</div>
```

**Der Inhalt muss zweimal im Markup stehen.** Die Spur wandert um `-50%` und springt damit exakt auf die Kopie. Werden die beiden Hälften ungleich breit, ruckelt die Naht sichtbar bei jedem Durchlauf.

Dauer aus der Anzahl der Elemente berechnen, damit die Geschwindigkeit gleich bleibt, wenn Einträge dazukommen. So macht es `scripts/techstack-data.mjs`:

```js
const duration = (items.length * 4.5).toFixed(1);   // Sekunden pro Element
```

Am Rand Abstand einplanen, sonst klebt das letzte Element an der Kopie:

```css
.meine-liste {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  padding-right: 2rem;   /* gleicher Wert wie gap */
}
```

Bringt automatisch mit: Rand-Ausblendung, Pause bei Hover und Tastaturfokus, Abschaltung bei `prefers-reduced-motion` (dann selbst scrollbar, Kopie ausgeblendet).

**Wann nicht:** Wenn der Inhalt ohnehin in den Container passt. Dann ist der Lauf Dekoration, und Dekoration ohne Zweck ist ein Anti-Ziel. Vorher prüfen:

```js
track.scrollWidth / 2 > container.clientWidth   // muss true sein
```

---

## 5. Einblenden beim Scrollen

**Nur auf `index.html` verfügbar.** Das Inline-Script dort vergibt `.reveal` an eine kuratierte Auswahl und setzt `.active`, sobald das Element ins Bild kommt.

Ein neues Element aufnehmen: die Selektorliste im Inline-Script von `index.html` erweitern.

```js
var revealTargets = document.querySelectorAll([
    '.icp-card', '.datenblatt', '.ablauf-step', '.kontrakt', '.arch',
    /* ... */ '.mein-neuer-block'
].join(','));
```

**Ganze Blöcke einblenden, nicht Zeile für Zeile.** Fünfzehn gestaffelte Einzelreveals sind dekorative Bewegung ohne Verkaufszweck. Die Systemakte blendet deshalb als ein Block ein.

**`class="reveal"` nicht von Hand ins Markup schreiben.** Siehe [Fallstricke](#fallstricke).

---

## 6. Bewegung, die argumentiert

Für Animationen mit Aussage, nicht zum Einblenden. Vorbild ist der Datenfluss-Puls, der an der EU-Grenze sichtbar gegen die Wand läuft.

Das Muster steht in `scripts/scroll-motion.js`: ein IntersectionObserver setzt `.is-live`, danach `unobserve`, die Animation läuft also **genau einmal**.

```js
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-live');
    observer.unobserve(entry.target);   // laeuft genau einmal
  });
}, { threshold: 0.35 });
```

Dazu im CSS **immer** den Ausstieg:

```css
.mein-element { opacity: 0; }
.mein-element.is-live { animation: mein-keyframe 0.5s var(--ease) forwards; }

/* Pflicht. Der Inhalt darf nie an der Animation haengen. */
.no-anim .mein-element { opacity: 1; animation: none; }

@media (prefers-reduced-motion: reduce) {
  .mein-element { opacity: 1; animation: none; }
}
```

`scroll-motion.js` setzt `.no-anim` auf `<html>`, wenn es nicht animieren kann. Ohne die beiden Regeln bleibt der Inhalt dann auf `opacity: 0` stehen und ist unsichtbar.

**Schwellenwert:** `threshold` beschreibt den Anteil **des Elements**, nicht des Viewports. Bei einem Element, das höher ist als der Bildschirm, kann ein hoher Wert nie erreicht werden. Für unbekannte Höhen `threshold: 0` mit negativem `rootMargin` unten.

---

## 7. Eyebrow und Überschriften

```html
<span class="mono-label">Warum RAIS</span>
<h2 class="section-h2">Die normale Sektionsüberschrift.</h2>
```

Die größere Stufe, **genau zweimal pro Seite**:

```html
<h2 class="section-h2 section-h2--anchor">Die tragende Frage.</h2>
```

Auf der Startseite sind das `#sicherheit` und `#systeme`, also die zwei Fragen, die ein Mittelstands-Geschäftsführer tatsächlich stellt.

`.mono-label` bringt den vorangestellten Strich mit und wechselt auf grünem Grund automatisch auf Salbei. **Keine Versalien**, Deutsch hat Großbuchstaben in Substantiven, Versalsatz zerstört das Wortbild.

---

## 8. Buttons

```html
<button type="button" class="btn-primary js-open-booking" data-source="sektionsname">
  Kostenlosen KI-Audit buchen
</button>

<a class="hero-btn-secondary" href="#handbuch">Erst das Prozesshandbuch lesen</a>
```

**Ein primärer CTA pro Sektion.** Zwei gleich laute Aktionen sind ein Anti-Ziel.

Schrift auf Mandarin ist **immer** `var(--on-orange)`, nie Weiß. Weiß ergibt 3.14:1 und reißt die Grenze. Gilt auch für Hover-Zustände, Pseudo-Elemente und Verlaufsflächen.

`data-source` benennt die Sektion und landet im Lead. Nicht weglassen.

---

## Fallstricke

**1. Das Inline-`<style>` in `index.html` gewinnt.** Es steht nach allen verlinkten CSS-Dateien. Eine neue Regel in `home.css` oder `site-multipage.css` mit **gleicher** Spezifität wie eine dort vorhandene greift auf der Startseite nicht. Betroffen sind unter anderem `.section-h2`, `.mono-label`, `#contact`, `.cal-load-btn`, `.sticky-cta-btn`, `.bm-btn-next`, `.trust-load-btn`. Höhere Spezifität (`.surface-green .section-h2`) und neue Klassennamen sind unproblematisch.

**2. `class="reveal"` niemals von Hand ins Markup.** `antigravity-polish.css` setzt `.reveal { opacity: 0 }` auf allen Seiten, aber nur das Inline-Script von `index.html` vergibt `.active`. Auf jeder anderen Seite bleibt so ausgezeichneter Inhalt **dauerhaft unsichtbar**.

**3. `.section-h2--anchor` existiert nur auf `index.html`.** Die Regel steht im dortigen Inline-Style. Wird die Stufe auf einer Unterseite gebraucht, muss sie nach `site-multipage.css` und dann mit höherer Spezifität als `.section-h2`.

**4. Neue Tokens gehören an zwei Stellen.** `:root` existiert doppelt: in `styles/site-multipage.css` und im Inline-`<style>` von `index.html`. Nur eine zu pflegen lässt Startseite und Unterseiten auseinanderlaufen.

**5. Markup der Unterseiten liegt in `scripts/build-pages.mjs`.** `aqut.html`, `referenzen.html`, `zusammenarbeit.html`, `ueber-uns.html` und `persoenlichkeit.html` werden bei jedem `npm run dev` neu geschrieben. Direkte Änderungen sind weg. Dasselbe gilt für die Marker-Bereiche in `index.html`.

**6. Kontrast im Browser **und** im CSS prüfen.** Ein Browser-Audit findet keine Hover-Zustände, keine Pseudo-Elemente und keine Verlaufsflächen, weil deren `backgroundColor` transparent ist. Beide Wege gehen, sonst bleiben Verstöße stehen.

---

## Kurz-Checkliste

Vor dem Ausliefern einer neuen Sektion:

- [ ] Höchstens drei grüne Flächen und eine Sage-Fläche auf der Seite
- [ ] Höchstens zwei `.section-h2--anchor`
- [ ] Ein primärer CTA, `data-source` gesetzt
- [ ] Keine Versalien-Eyebrows, keine Gedankenstriche in sichtbarer Copy
- [ ] Jede Zahl belegt oder aus Nutzereingabe abgeleitet
- [ ] Jede Animation hat einen `.no-anim`- und einen `prefers-reduced-motion`-Ausstieg
- [ ] Bei `prefers-reduced-motion` steht der komplette Inhalt sofort sichtbar da
- [ ] Fließtext über 4.5:1, große Schrift über 3:1, im Browser nachgemessen
- [ ] 375px geprüft, kein horizontaler Overflow
- [ ] Klarheit, Relevanz, Autorität: besteht die Sektion alle drei?
