<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Privacy Policy | RAIS</title>
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
    <nav class="topnav" aria-label="Legal navigation">
        <a href="index.html">Home</a>
        <a href="impressum-en.html">Legal Notice</a>
        <a href="privacy.html">Privacy Policy</a>
    </nav>
</header>
<main class="site-shell">
    <section class="page-frame">
        <div class="signal-label">RAIS / Ritz AI Solutions — Privacy</div>
        <div class="signal-divider"></div>
        <article class="legal-copy">
            {{eRecht24_legal_text}}
            <section aria-labelledby="rais-custom-services">
                <h2 id="rais-custom-services">Additional notes on the services actually in use</h2>

                <h3>Consent management tool CCM19</h3>
                <p>We use the consent management tool CCM19 on this website in order to manage consent decisions for services requiring consent, document these decisions and technically enable withdrawals. The provider is Papoo Software &amp; Media GmbH, Auguststr. 4, 53229 Bonn, Germany. This may involve the processing of your consent choices, technical device information, shortened IP addresses and time stamps.</p>
                <p>This use serves the fulfillment of our legal obligations regarding consent management and documentation and is based on Art. 6(1)(c) GDPR, Art. 6(1)(f) GDPR and, where access to end-device information is concerned, Section 25(2) No. 2 TDDDG.</p>

                <h3>Calendly only after deliberate user action</h3>
                <p>The external Calendly embed is not loaded on this website on the mere basis of opening the page. The widget is only loaded after an explicit user action in the booking section. Without that click, only an external link to Calendly remains available.</p>

                <h3>Supabase as an external database service</h3>
                <p>We use Supabase as an external technical service provider for selected forms and structured data storage on this website. The provider is Supabase, Inc., 970 Toa Payoh North, Singapore. Supabase processes personal data on our behalf as a processor. This may include form content, contact details, technically required metadata and stored records needed to process inquiries, provide functions or manage leads.</p>
                <p>This use is based on Art. 6(1)(b) GDPR where processing is necessary to handle your inquiry or carry out pre-contractual measures, and additionally on Art. 6(1)(f) GDPR due to our legitimate interest in a reliable, scalable and secure technical infrastructure. Where consent is requested, processing is based on Art. 6(1)(a) GDPR.</p>
                <p>We have concluded a Data Processing Agreement (DPA) with Supabase. Where data is processed in third countries, this is based on the standard contractual clauses of the European Commission. Further information about Supabase's data processing is available at <a href="https://supabase.com/privacy" target="_blank" rel="noopener">https://supabase.com/privacy</a>.</p>

                <h3>Self-hosted n8n instance at Hostinger</h3>
                <p>We use a self-hosted n8n instance to technically process selected website requests and automation workflows. This instance is not used as an end-user cloud service of a third party, but as part of our own technical infrastructure hosted on systems operated by Hostinger. Form submissions, chat requests and internal workflow steps may in particular be processed through this n8n instance and forwarded to downstream systems.</p>
                <p>Processing is based on Art. 6(1)(b) GDPR where it is required to handle your inquiry or perform pre-contractual measures, and on Art. 6(1)(f) GDPR due to our legitimate interest in an efficient, secure and traceable technical handling of our website processes. Where hosting services are concerned, the technical infrastructure is provided via Hostinger.</p>
                <p>According to Hostinger's current privacy policy, Hostinger International Ltd. is based in Cyprus. Further information about Hostinger's data processing is available at <a href="https://www.hostinger.com/legal/privacy-policy" target="_blank" rel="noopener">https://www.hostinger.com/legal/privacy-policy</a>.</p>

            </section>
        </article>
    </section>
</main>
<footer class="site-shell site-footer">
    <div>Clear legal pages, aligned with the live stack and kept readable.</div>
    <div class="footer-links">
        <a href="index.html">Home</a>
        <a href="impressum-en.html">Legal Notice</a>
        <a href="privacy.html">Privacy Policy</a>
    </div>
</footer>
</body>
</html>
