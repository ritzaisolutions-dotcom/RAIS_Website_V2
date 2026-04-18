<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Datenschutzerklärung | RAIS</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" type="image/png" href="favicon.png?v=3" />
    <link rel="stylesheet" href="fonts.css" />
    <script src="https://cloud.ccm19.de/app.js?apiKey=44ff2519f360f540f17d013a2a4094e2019143535dcc7c76&domain=69e29700b6f98fcee101f2d2" referrerpolicy="origin"></script>
    <style>
        :root {
            --background: 40 29% 94%;
            --foreground: 24 13% 16%;
            --border: 36 21% 83%;
            --industrial-orange: 18 83% 57%;
            --dark-pistachio: 95 28% 26%;
            --muted-stone: 31 8% 42%;
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            background-image:
                radial-gradient(circle at top right, rgba(143, 159, 114, 0.22), transparent 28%),
                radial-gradient(circle at 16% 18%, rgba(72, 96, 54, 0.14), transparent 24%),
                linear-gradient(180deg, rgba(251, 248, 243, 0.98), rgba(244, 241, 234, 1));
        }

        a {
            color: inherit;
        }

        .site-shell {
            width: min(64rem, calc(100vw - 2rem));
            margin: 0 auto;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: center;
            padding: 1.5rem 0 1rem;
        }

        .brand {
            font-family: "Baskerville", "Palatino Linotype", "Book Antiqua", serif;
            font-size: 1.9rem;
            color: hsl(var(--foreground));
            text-decoration: none;
        }

        .topnav {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            font-size: 0.95rem;
            color: hsl(var(--muted-stone));
        }

        .topnav a {
            text-decoration: none;
        }

        .topnav a:hover,
        .topnav a:focus-visible {
            color: hsl(var(--foreground));
        }

        .page-frame {
            background: rgba(251, 248, 243, 0.94);
            border: 1px solid rgba(72, 96, 54, 0.18);
            border-radius: 1.75rem;
            box-shadow: 0 18px 48px rgba(47, 42, 36, 0.06);
            padding: clamp(1.25rem, 3vw, 2.5rem);
            margin: 1rem auto 2rem;
        }

        .signal-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: hsl(var(--dark-pistachio));
            margin-bottom: 0.75rem;
        }

        .signal-divider {
            height: 1px;
            background: linear-gradient(90deg, rgba(72, 96, 54, 0.82), rgba(236, 106, 55, 0.55), rgba(217, 209, 199, 0.18));
            margin: 0 0 1.5rem;
        }

        .legal-copy {
            max-width: 50rem;
            margin: 0 auto;
            color: hsl(var(--muted-stone));
            line-height: 1.72;
            font-size: 1rem;
            overflow-wrap: anywhere;
        }

        .legal-copy h1,
        .legal-copy h2,
        .legal-copy h3,
        .legal-copy h4 {
            font-family: "Baskerville", "Palatino Linotype", "Book Antiqua", serif;
            color: hsl(var(--foreground));
            line-height: 1.15;
            margin: 0 0 1rem;
        }

        .legal-copy h1 {
            font-size: clamp(2rem, 4vw, 3.4rem);
            margin-bottom: 1.15rem;
        }

        .legal-copy h2 {
            font-size: clamp(1.45rem, 2.8vw, 2rem);
            margin-top: 2.1rem;
        }

        .legal-copy h3 {
            font-size: 1.15rem;
            margin-top: 1.55rem;
        }

        .legal-copy p,
        .legal-copy ul,
        .legal-copy ol,
        .legal-copy table,
        .legal-copy blockquote {
            margin: 0 0 1rem;
        }

        .legal-copy ul,
        .legal-copy ol {
            padding-left: 1.25rem;
        }

        .legal-copy li + li {
            margin-top: 0.45rem;
        }

        .legal-copy strong,
        .legal-copy b {
            color: hsl(var(--foreground));
        }

        .legal-copy a {
            color: hsl(var(--industrial-orange));
            text-decoration: none;
        }

        .legal-copy a:hover,
        .legal-copy a:focus-visible {
            color: hsl(var(--foreground));
            text-decoration: underline;
        }

        .legal-copy table {
            width: 100%;
            border-collapse: collapse;
            display: block;
            overflow-x: auto;
            border: 1px solid hsl(var(--border));
            border-radius: 1rem;
            background: rgba(251, 248, 243, 0.85);
        }

        .legal-copy th,
        .legal-copy td {
            padding: 0.85rem 1rem;
            border-bottom: 1px solid hsl(var(--border));
            text-align: left;
            vertical-align: top;
        }

        .legal-copy th {
            color: hsl(var(--foreground));
            background: rgba(120, 148, 100, 0.12);
        }

        .legal-copy tr:last-child td {
            border-bottom: 0;
        }

        .site-footer {
            padding: 0 0 2.5rem;
            color: hsl(var(--muted-stone));
            font-size: 0.92rem;
        }

        .site-footer .footer-links {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 0.75rem;
        }

        .site-footer .footer-links a {
            text-decoration: none;
        }

        .site-footer .footer-links a:hover,
        .site-footer .footer-links a:focus-visible {
            color: hsl(var(--foreground));
        }

        @media (max-width: 720px) {
            .topbar {
                align-items: flex-start;
                flex-direction: column;
            }

            .page-frame {
                border-radius: 1.5rem;
                padding: 1.25rem;
            }
        }
    </style>
</head>
<body>
<header class="site-shell topbar">
    <a href="index.html" class="brand">RAIS</a>
    <nav class="topnav" aria-label="Rechtliche Navigation">
        <a href="index.html">Startseite</a>
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
    </nav>
</header>
<main class="site-shell">
    <section class="page-frame">
        <div class="signal-label">RAIS / Ritz AI Solutions — Datenschutz</div>
        <div class="signal-divider"></div>
        <article class="legal-copy">
            {{eRecht24_legal_text}}
            <section aria-labelledby="rais-custom-services">
                <h2 id="rais-custom-services">Ergänzende Hinweise zu den tatsächlich eingesetzten Diensten</h2>

                <h3>Consent-Tool CCM19</h3>
                <p>Wir nutzen auf dieser Website das Consent-Management-Tool CCM19, um Einwilligungen für einwilligungsbedürftige Dienste zu verwalten, zu dokumentieren und Widerrufe technisch abzubilden. Anbieter ist die Papoo Software &amp; Media GmbH, Auguststr. 4, 53229 Bonn. Dabei können insbesondere die von Ihnen getroffenen Einwilligungsentscheidungen, technische Geräteinformationen, gekürzte IP-Adressen sowie Zeitstempel verarbeitet werden.</p>
                <p>Die Nutzung erfolgt zur Erfüllung unserer gesetzlichen Verpflichtungen im Zusammenhang mit Einwilligungs- und Nachweispflichten sowie auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO, Art. 6 Abs. 1 lit. f DSGVO und, soweit der Zugriff auf Endgeräteinformationen betroffen ist, § 25 Abs. 2 Nr. 2 TDDDG.</p>

                <h3>Calendly erst nach bewusster Nutzeraktion</h3>
                <p>Die externe Calendly-Einbindung wird auf dieser Website nicht bereits beim bloßen Seitenaufruf geladen. Das Widget wird erst nach einer ausdrücklichen Nutzeraktion in der Buchungssektion nachgeladen. Ohne diesen Klick bleibt es bei einem externen Link zu Calendly.</p>

                <h3>Supabase als externer Datenbankdienst</h3>
                <p>Für einzelne Formulare und strukturierte Datenspeicherung auf dieser Website nutzen wir Supabase als externen technischen Dienstleister. Anbieter ist Supabase, Inc., 970 Toa Payoh North, Singapur. Supabase verarbeitet personenbezogene Daten in unserem Auftrag als Auftragsverarbeiter. Dabei kann es insbesondere um Formularinhalte, Kontaktdaten, technisch erforderliche Metadaten und gespeicherte Datensätze gehen, die zur Bearbeitung von Anfragen, zur Bereitstellung von Funktionen oder zur Verwaltung von Leads erforderlich sind.</p>
                <p>Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung für die Durchführung vorvertraglicher Maßnahmen oder die Bearbeitung Ihrer Anfrage erforderlich ist, sowie ergänzend auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an einer zuverlässigen, skalierbaren und sicheren technischen Infrastruktur. Soweit eine Einwilligung abgefragt wird, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.</p>
                <p>Wir haben einen Vertrag über Auftragsverarbeitung (AVV) mit Supabase geschlossen. Soweit Daten in Drittstaaten verarbeitet werden, erfolgt dies auf Grundlage der Standardvertragsklauseln der EU-Kommission. Weitere Informationen zur Datenverarbeitung durch Supabase finden Sie unter <a href="https://supabase.com/privacy" target="_blank" rel="noopener">https://supabase.com/privacy</a>.</p>

                <h3>Selbst gehostete n8n-Instanz bei Hostinger</h3>
                <p>Zur technischen Verarbeitung einzelner Website-Anfragen und Automatisierungsabläufe nutzen wir eine von uns selbst betriebene n8n-Instanz. Diese Instanz wird nicht als Cloud-Dienst eines Drittanbieters für Endnutzer eingesetzt, sondern als Teil unserer eigenen technischen Infrastruktur auf Hosting-Systemen bei Hostinger betrieben. Über diese n8n-Instanz können insbesondere Formularanfragen, Chat-Anfragen oder interne Workflow-Schritte verarbeitet und an nachgelagerte Systeme weitergeleitet werden.</p>
                <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit sie zur Bearbeitung Ihrer Anfrage oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist, sowie auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an einer effizienten, sicheren und nachvollziehbaren technischen Abwicklung unserer Website-Prozesse. Soweit Hosting-Leistungen betroffen sind, erfolgt die technische Bereitstellung über unseren Hosting-Dienstleister Hostinger.</p>
                <p>Nach der aktuellen Datenschutzerklärung von Hostinger ist Hostinger International Ltd. in Zypern ansässig. Weitere Informationen zur Datenverarbeitung durch Hostinger finden Sie unter <a href="https://www.hostinger.com/legal/privacy-policy" target="_blank" rel="noopener">https://www.hostinger.com/legal/privacy-policy</a>.</p>

            </section>
        </article>
    </section>
</main>
<footer class="site-shell site-footer">
    <div>Klare Rechtstexte, am echten Stack ausgerichtet und lesbar gehalten.</div>
    <div class="footer-links">
        <a href="index.html">Startseite</a>
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
    </div>
</footer>
</body>
</html>
