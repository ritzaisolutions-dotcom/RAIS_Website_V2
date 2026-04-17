<?php
$http_method = $_SERVER['REQUEST_METHOD'];
$configFile = ($files = glob("*.eRecht24.json"))
    ? $files[0]
    : null;

// Pull / Push
if ($configFile && (strtolower($http_method) === 'get')):
        require_once 'vendor/autoload.php';
        new \ERecht24\PullPushController($configFile);
        die();
endif;

// Installer already finished
if ($configFile && strtolower($http_method) === 'post'):
    header("HTTP/1.1 401 Unauthorized");
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Die Installer ist bereits vollständig durchgelaufen.']);
    die();
endif;

// Helper requested
if (!$configFile && strtolower($http_method) === 'post'):
    require_once 'vendor/autoload.php';
    new \ERecht24\InstallationHelper($_POST["method"] ?? null);
    die();
endif;

// Installer
if (!$configFile && (strtolower($http_method) === 'get')): ?>
    <html>
        <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
            <title>Installer - eRecht24 Rechtstexte Plugin für HTML/PHP</title>
            <link rel="stylesheet" type="text/css" href="./tailwind.min.css" />
            <style>
                .logoContainer {
                    position: absolute;
                }
                @media screen and ( max-height: 600px )
                {
                    .logoContainer {
                        position: static;
                    }
                }
            </style>
        </head>
        <body id="body" data-completed="">
        <div class="h-screen flex overflow-hidden bg-gray-50">
            <!-- Static sidebar for desktop -->
            <div class="flex flex-col flex-shrink-0 relative bg-white border-r border-gray-200 overflow-auto">
                <div class="px-8 py-6 logoContainer">
                    <!-- eRecht24 Logo SVG -->
                    <svg style="width: 190px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 232.16 71.41"><defs><style>.cls-1{fill:#055d82;}.cls-2{fill:url(#linear-gradient);}</style><linearGradient id="linear-gradient" x1="12.8" y1="12.57" x2="34.08" y2="41.15" gradientUnits="userSpaceOnUse"><stop offset="0.02" stop-color="#53c3ee"></stop><stop offset="1" stop-color="#008cd2"></stop></linearGradient></defs><g id="Ebene_2" data-name="Ebene 2"><g id="eRecht24_Logo_Standard_Version" data-name="eRecht24 Logo Standard Version"><g id="Logotype"><path class="cls-1" d="M70.3,46.93A8,8,0,0,1,67.45,52c-1.53,1.23-3.73,1.84-6.58,1.84q-5.07,0-7.77-3.06t-2.7-8.56a15.73,15.73,0,0,1,.77-5.11,10.52,10.52,0,0,1,2.17-3.73,9.37,9.37,0,0,1,3.32-2.29,12,12,0,0,1,8.62,0,8,8,0,0,1,3,2.25,9.59,9.59,0,0,1,1.75,3.41,15.22,15.22,0,0,1,.58,4.33V43H54.18a10,10,0,0,0,.45,3.11,7.52,7.52,0,0,0,1.28,2.49A5.91,5.91,0,0,0,58,50.23a6.56,6.56,0,0,0,2.88.6,6.42,6.42,0,0,0,4.07-1,5.31,5.31,0,0,0,1.76-2.85Zm-3.39-6.74a11.13,11.13,0,0,0-.34-2.87,6.15,6.15,0,0,0-1.07-2.21,5.07,5.07,0,0,0-1.89-1.44,6.88,6.88,0,0,0-2.79-.51A5.94,5.94,0,0,0,56.21,35a8.67,8.67,0,0,0-2,5.23Z"></path><path class="cls-1" d="M75.23,22.52h10a17.3,17.3,0,0,1,5.62.77,9.35,9.35,0,0,1,3.45,2,6.5,6.5,0,0,1,1.74,2.77,10.74,10.74,0,0,1,.47,3.13,9.61,9.61,0,0,1-1.22,5,8.1,8.1,0,0,1-4,3.22l6.43,13.76H93.33L87.54,40.32a10.68,10.68,0,0,1-1.2.11l-1.16,0h-6V53.14H75.23ZM85.65,37.06A11.44,11.44,0,0,0,89,36.65a5,5,0,0,0,2.1-1.15,4,4,0,0,0,1.08-1.83,8.85,8.85,0,0,0,.3-2.4A6.85,6.85,0,0,0,92.17,29,3.89,3.89,0,0,0,91,27.3a5.62,5.62,0,0,0-2.25-1.07,14.92,14.92,0,0,0-3.6-.36h-6V37.06Z"></path><path class="cls-1" d="M119.28,46.93A8,8,0,0,1,116.43,52q-2.3,1.84-6.59,1.84-5.06,0-7.76-3.06t-2.7-8.56a15.73,15.73,0,0,1,.77-5.11,10.37,10.37,0,0,1,2.17-3.73,9.19,9.19,0,0,1,3.32-2.29,12,12,0,0,1,8.62,0,7.92,7.92,0,0,1,3,2.25A9.45,9.45,0,0,1,119,36.76a15.22,15.22,0,0,1,.58,4.33V43H103.15a10.34,10.34,0,0,0,.45,3.11,7.54,7.54,0,0,0,1.29,2.49A5.91,5.91,0,0,0,107,50.23a6.55,6.55,0,0,0,2.87.6,6.43,6.43,0,0,0,4.08-1,5.37,5.37,0,0,0,1.76-2.85Zm-3.39-6.74a11.13,11.13,0,0,0-.34-2.87,6,6,0,0,0-1.08-2.21,5,5,0,0,0-1.88-1.44,6.88,6.88,0,0,0-2.79-.51,5.94,5.94,0,0,0-4.61,1.8,8.67,8.67,0,0,0-2,5.23Z"></path><path class="cls-1" d="M143.77,45.64a9.78,9.78,0,0,1-2.92,6,9.41,9.41,0,0,1-6.65,2.19,11.62,11.62,0,0,1-4.48-.81,8.71,8.71,0,0,1-3.26-2.34,10.12,10.12,0,0,1-2-3.69,16.67,16.67,0,0,1-.67-4.87,15.37,15.37,0,0,1,.73-4.84,10.6,10.6,0,0,1,2.1-3.73A9.59,9.59,0,0,1,130,31.14a11.09,11.09,0,0,1,4.46-.85,9,9,0,0,1,6.18,2,9,9,0,0,1,2.78,5.38l-3.73.69a10.2,10.2,0,0,0-.58-2,4.69,4.69,0,0,0-1-1.56,4.25,4.25,0,0,0-1.57-1,6,6,0,0,0-2.21-.37,6.33,6.33,0,0,0-3,.67,5.63,5.63,0,0,0-2,1.84,8.13,8.13,0,0,0-1.15,2.77,14.74,14.74,0,0,0-.37,3.39,16,16,0,0,0,.34,3.39,8,8,0,0,0,1.12,2.76,5.55,5.55,0,0,0,2,1.87,6.22,6.22,0,0,0,3,.68,5.28,5.28,0,0,0,4-1.37A6.81,6.81,0,0,0,140,45.64Z"></path><path class="cls-1" d="M147.67,22.52h3.73V34.27a10.28,10.28,0,0,1,3.58-3,9.37,9.37,0,0,1,4.14-.94c2.52,0,4.38.68,5.6,2.05s1.82,3.39,1.82,6V53.14h-3.77v-14c0-2.06-.37-3.51-1.1-4.35a4.24,4.24,0,0,0-3.41-1.27,7.5,7.5,0,0,0-2.46.43,6.11,6.11,0,0,0-2.21,1.37,7.08,7.08,0,0,0-1.63,2A5.82,5.82,0,0,0,151.4,40V53.14h-3.73Z"></path><path class="cls-1" d="M173.4,33.93H170V31h3.43v-6h3.73v6H183v3h-5.88v13a4.34,4.34,0,0,0,.73,2.61,2.59,2.59,0,0,0,2.23,1,8.59,8.59,0,0,0,3-.47l.65,2.87a13.77,13.77,0,0,1-1.87.49,12.67,12.67,0,0,1-2.38.2,7.13,7.13,0,0,1-3-.56,4.51,4.51,0,0,1-1.84-1.59,6.15,6.15,0,0,1-.92-2.44,18.63,18.63,0,0,1-.24-3.09Z"></path><path class="cls-1" d="M187.77,50.06q1.64-1.45,3.52-3.09c1.26-1.09,2.53-2.2,3.81-3.35s2.58-2.29,3.61-3.28a23.1,23.1,0,0,0,2.57-2.85,10.44,10.44,0,0,0,1.54-2.79,8.67,8.67,0,0,0,.52-3,5.57,5.57,0,0,0-1.46-4.14,5.54,5.54,0,0,0-4.07-1.44,9.29,9.29,0,0,0-2.71.35,5.05,5.05,0,0,0-1.88,1A5.35,5.35,0,0,0,192,29.08a13.94,13.94,0,0,0-.88,2.32l-3.56-.56a16.29,16.29,0,0,1,1.08-3,8.35,8.35,0,0,1,1.88-2.59,9.14,9.14,0,0,1,3-1.85,12.22,12.22,0,0,1,4.42-.71,11.63,11.63,0,0,1,4,.65,8.21,8.21,0,0,1,2.94,1.78,7.44,7.44,0,0,1,1.8,2.72,9.46,9.46,0,0,1,.62,3.52,11.65,11.65,0,0,1-.53,3.6,12.74,12.74,0,0,1-1.65,3.3,24.72,24.72,0,0,1-2.83,3.35c-1.15,1.14-2.5,2.39-4.08,3.73-.83.71-1.68,1.44-2.55,2.17s-1.72,1.46-2.55,2.2h14.5L207,53.14H187.77Z"></path><path class="cls-1" d="M210.33,43l14.11-19.47h3.65V42.72h4.07l-.52,3.05h-3.55v7.37h-3.61V45.77H210.33Zm14.15-.26V28.44L214.23,42.72Z"></path></g><g id="Symbol"><path class="cls-1" d="M12.29,32a66.84,66.84,0,0,0-6.75,7.13C3.15,42.05-.1,46.67,0,50.24c.16,5.47,8.36,3.62,11.8,1.6a.09.09,0,0,0-.07-.16C8.9,52.5,3.47,53.49,4.63,49A17.21,17.21,0,0,1,7.34,44,55.55,55.55,0,0,1,14,36.66l1.55-1.43A24.87,24.87,0,0,1,12.29,32Z"></path><path class="cls-1" d="M47.58,17.37c-1.25-3.69-7.44-2.14-10.11-1.28-6.14,2-11.83,5.48-17,9.25L19,26.4a22.82,22.82,0,0,0,3.49,3.17c2-1.44,4-2.81,6.14-4.07A48.76,48.76,0,0,1,37,21.31a13.26,13.26,0,0,1,5.43-1c4.86.62,0,7.85-2.28,10.81h0c-.15.19-.17.37,0,.23A34.23,34.23,0,0,0,44.11,27C46,24.59,48.57,20.65,47.58,17.37Z"></path><path class="cls-2" d="M36.26,28.49a10.31,10.31,0,0,0-1.77-4.71A58.77,58.77,0,0,0,29.3,26.6l-.23.15c1.61,2,2.5,4.32,1.35,7.08a6.25,6.25,0,0,1-1.82,2.36A46.05,46.05,0,0,0,23,31.61C19.49,29,14.38,25.24,16.56,20a6.3,6.3,0,0,1,1.82-2.35,40.2,40.2,0,0,0,4.95,4.12c2-1.3,3.88-2.45,5.73-3.44-1.34-1-2.69-2-3.89-3-2.2-1.79-4.52-3.69-4.46-6.92a6.18,6.18,0,0,1,4.07-5.63,6.71,6.71,0,0,1,7,1.8.17.17,0,0,0,.27-.2A8.64,8.64,0,0,0,21.53.5a9.83,9.83,0,0,0-6.71,9.82,10.19,10.19,0,0,0,1.85,5.27,9.32,9.32,0,0,0-6,9.75c.6,6,6.83,9.73,11.08,13.17,2.21,1.79,4.53,3.69,4.46,6.92a6.13,6.13,0,0,1-4.07,5.63,6.72,6.72,0,0,1-7-1.8.16.16,0,0,0-.26.2,8.61,8.61,0,0,0,10.55,3.87,9.82,9.82,0,0,0,6.71-9.82,10,10,0,0,0-1.85-5.26A9.36,9.36,0,0,0,36.26,28.49Z"></path></g><path class="cls-1" d="M147.7,60.36h3.73a6,6,0,0,1,2,.28,3.2,3.2,0,0,1,1.25.72,2.47,2.47,0,0,1,.63,1,4.28,4.28,0,0,1,.18,1.24,4.8,4.8,0,0,1-.18,1.33,2.59,2.59,0,0,1-.64,1.11,3.1,3.1,0,0,1-1.24.75,5.93,5.93,0,0,1-2,.28h-2v4h-1.8Zm3.71,5.24a3.93,3.93,0,0,0,1.14-.14,1.84,1.84,0,0,0,.71-.38,1.4,1.4,0,0,0,.35-.6,3.08,3.08,0,0,0,.1-.78,2.64,2.64,0,0,0-.11-.79,1.16,1.16,0,0,0-.37-.57,1.75,1.75,0,0,0-.71-.35,4.35,4.35,0,0,0-1.12-.12h-1.9V65.6Z"></path><path class="cls-1" d="M164,60.36a6,6,0,0,1,2,.29,3.35,3.35,0,0,1,1.26.75,2.51,2.51,0,0,1,.64,1,3.52,3.52,0,0,1,.18,1.1,3.4,3.4,0,0,1-.42,1.76,2.93,2.93,0,0,1-1.33,1.15l2.23,4.7h-2l-1.93-4.28-.29,0h-2.25v4.25h-1.79V60.36Zm.14,5a3.29,3.29,0,0,0,1-.13,1.42,1.42,0,0,0,.64-.36,1.18,1.18,0,0,0,.33-.56,2.5,2.5,0,0,0,.1-.74,2.17,2.17,0,0,0-.11-.69,1.24,1.24,0,0,0-.38-.53A1.91,1.91,0,0,0,165,62a4.16,4.16,0,0,0-1.09-.12h-1.84v3.47Z"></path><path class="cls-1" d="M173,60.36h7.16v1.57h-5.34V64.8h5v1.58h-5v3.19h5.63l-.21,1.56H173Z"></path><path class="cls-1" d="M185.19,60.36h2.22l3.06,8.57,3.15-8.57h2.14V71.13h-1.67V63.31l-3,7.82h-1.45l-2.85-7.81v7.81h-1.64Z"></path><path class="cls-1" d="M201.07,60.36h1.83V71.13h-1.83Z"></path><path class="cls-1" d="M209.84,60.36v6.46a3.8,3.8,0,0,0,.55,2.27,2.14,2.14,0,0,0,1.86.75,2.1,2.1,0,0,0,1.83-.75,3.88,3.88,0,0,0,.54-2.27V60.36h1.82v6.46a6.52,6.52,0,0,1-.3,2.12,3.66,3.66,0,0,1-.86,1.42,3.39,3.39,0,0,1-1.33.8,5.71,5.71,0,0,1-1.72.25,4.15,4.15,0,0,1-3.13-1.11A4.91,4.91,0,0,1,208,66.78V60.36Z"></path><path class="cls-1" d="M221.59,60.36h2.21l3.07,8.57L230,60.36h2.14V71.13h-1.67V63.31l-3,7.82h-1.45l-2.85-7.81v7.81h-1.64Z"></path></g></g></svg>
                </div>
                <div class="flex flex-col w-64 p-8 xl:py-10 my-auto">

                    <!-- Fortschritt -->
                    <div class="">
                        <h2 id="timeline-title" class="text-lg font-medium text-gray-900">Fortschritt</h2>
                        <div class="mt-6 flow-root">
                            <ul class="-mb-8">
                                <li data-target="step1">
                                    <div class="relative pb-8" >
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <a href="#" class="checkPoint h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                    <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <a href="#" class="font-medium text-gray-900">API-Schlüssel</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li data-target="step2">
                                    <div class="relative pb-8">
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <a href="#" class="checkPoint h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                    <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <a href="#" class="font-medium text-gray-900">Dateinamen</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li data-target="step3">
                                    <div class="relative pb-8">
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <a href="#" class="checkPoint h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                    <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <a href="#" class="font-medium text-gray-900">Speicherort</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li data-target="step4">
                                    <div class="relative pb-8">
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <a href="#" class="checkPoint h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                    <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <a href="#" class="font-medium text-gray-900">API-Client</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li data-target="step5">
                                    <div class="relative pb-8">
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <a href="#" class="checkPoint h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                    <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    <a href="#" class="font-medium text-gray-900">Speichern</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-0 flex-1 overflow-hidden">
                <main class="min-w-0 flex-1 h-full flex flex-col overflow-hidden p-8 xl:py-10">
                    <div class="max-h-full overflow-y-auto my-auto bg-gradient-blue text-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
                        <div class="step active" id="step1">
                            <form class="nextStepForm" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="POST">
                                <input type="hidden" name="method" value="checkApiKey">
                                <div>
                                    <div class="space-y-8">
                                        <div>
                                            <h3 class="text-lg leading-6 font-medium">
                                                Ihr API-Schlüssel
                                            </h3>
                                            <div class="mt-1 max-w-3xl text-sm text-white relative">
                                                <span>Bitte tragen Sie hier Ihren eRecht24 Premium API-Schlüssel ein.</span>
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline-block cursor-pointer ml-1 -mt-1 hintTrigger">
                                                    <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999zm0 1.5a8.502 8.502 0 100 17.003A8.502 8.502 0 0012 3.5v-.001zm-.004 7a.75.75 0 01.744.648l.007.102.003 5.502a.75.75 0 01-1.493.102l-.007-.101-.003-5.502a.75.75 0 01.75-.75l-.001-.001zM12 7.003A.999.999 0 1112.063 9 .999.999 0 0112 7.003z" fill="currentColor" />
                                                </svg>
                                                <div class="hintContentContainer z-20 hidden fixed inset-0 flex justify-center items-center">
                                                    <div class="hintContent rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                                        <div class="relative grid gap-6 bg-white p-6 text-gray-900">
                                                            <div class="">
                                                                <div class="flex space-x-3 justify-between">
                                                                    <div>
                                                                        <p class="text-base font-medium text-gray-900 ">eRecht24 Premium API-Schlüssel</p>
                                                                        <p class="mt-1 text-sm text-gray-500">
                                                                            Um Ihren eRecht24 Premium API-Schlüssel zu erhalten gehen Sie bitte wie folgt vor:
                                                                        </p>
                                                                    </div>
                                                                    <span onclick="closeHints()" class="closeHint cursor-pointer">x</span>
                                                                </div>

                                                                <div class="pt-4">
                                                                    <div class="border-t border-gray-300"></div>
                                                                </div>
                                                            </div>
                                                            <p>1. Loggen Sie sich mit Ihren eRecht24 Premium Zugangsdaten auf <a target="_blank" href="https://www.e-recht24.de/">https://www.e-recht24.de/</a> ein.</p>
                                                            <p>2. Rufen Sie den eRecht24 Projekt Manager unter <a target="_blank" href="https://www.e-recht24.de/mitglieder/tools/projekt-manager/">https://www.e-recht24.de/mitglieder/tools/projekt-manager/</a> auf.</p>
                                                            <p>3. Klicken Sie beim entsprechenden Projekt auf das Zahnrad-Icon, um zu den Einstellungen zu gelangen.</p>
                                                            <p>4. Sollte noch kein API-Schlüssel erzeugt sein, klicken Sie auf den Button "Neuen API-Schlüssel erzeugen".</p>
                                                            <p>5. Kopieren Sie den API-Schlüssel über den Button dahinter in die Zwischenablage.</p>
                                                            <p>6. Fügen Sie den API-Schlüssel hier ein.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <label for="api_key" class="block font-medium">
                                                API Key
                                            </label>
                                            <div class="mt-1">
                                                <input
                                                        type="text"
                                                        name="api_key"
                                                        id="api_key"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-primary">
                                            </div>
                                        </div>
                                        <div>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                            <div class="flex space-x-2">
                                                <button class="button ml-auto" type="submit">Weiter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="step" id="step2">
                            <form class="nextStepForm" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="POST">
                                <input type="hidden" name="method" value="checkMapping">
                                <div>
                                    <div class="space-y-6">
                                        <div>
                                            <h3 class="text-lg leading-6 font-medium">
                                                Dateinamen
                                            </h3>
                                            <p class="mt-1 text-sm text-white">
                                                Bitte tragen Sie hier die gewünschten Namen für Ihre Rechtstexte ein.
                                                Die Endung .html wird automatisch hinzugefügt.
                                                Wir speichern Ihre Rechtstexte als HTML-Dateien auf Ihren Webspace.
                                                <br><br>
                                                <strong>Bitte beachten Sie, dass ausschließlich Buchstaben, Ziffern und die Zeichen "-" (Minus) und "_" (Unterstrich) verwendet werden dürfen.</strong>
                                            </p>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="impressum" class="block font-medium">
                                                Impressum (deutsche Version)
                                            </label>
                                            <div class="mt-1">
                                                <div class="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                            type="text"
                                                            name="impressum"
                                                            id="impressum"
                                                            value="impressum"
                                                            class="max-w-lg shadow-sm flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-primary border-gray-300">
                                                    <span class="inline-flex items-center px-3 rounded-r-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                        .html
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="datenschutz" class="block font-medium">
                                                Datenschutzerklärung (deutsche Version)
                                            </label>
                                            <div class="mt-1">
                                                <div class="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                            type="text"
                                                            name="datenschutz"
                                                            id="datenschutz"
                                                            value="datenschutz"
                                                            class="max-w-lg shadow-sm flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-primary border-gray-300">
                                                    <span class="inline-flex items-center px-3 rounded-r-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                                .html
                                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pt-8">
                                            <p class="font-medium">
                                                Optional:
                                            </p>
                                            <p class="mt-1 text-sm text-white max-w-lg">
                                                Legen Sie nachfolgend auch die Dateinamen für Ihre englischsprachigen
                                                Rechtstexte fest - sofern Sie diese aktiviert haben.
                                            </p>
                                        </div>
                                        <div>
                                            <label for="site_notice" class="block font-medium">
                                                Site Notice (englische Version)
                                            </label>
                                            <div class="mt-1">
                                                <div class="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                            type="text"
                                                            name="site_notice"
                                                            id="site_notice"
                                                            class="max-w-lg shadow-sm flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-primary border-gray-300">
                                                    <span class="inline-flex items-center px-3 rounded-r-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                                .html
                                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="privacy" class="block font-medium">
                                                Privacy Policy (englische Version)
                                            </label>
                                            <div class="mt-1">
                                                <div class="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                            type="text"
                                                            name="privacy"
                                                            id="privacy"
                                                            class="max-w-lg shadow-sm flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-primary border-gray-300">
                                                    <span class="inline-flex items-center px-3 rounded-r-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                                .html
                                                            </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                            <div class="flex space-x-2">
                                                <button class="button2 mr-auto" type="button">Zurück</button>
                                                <button class="button ml-auto go-back" type="submit">Weiter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="step" id="step3">
                            <form class="nextStepForm" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="POST">
                                <input type="hidden" name="method" value="checkDirectory">
                                <div>
                                    <div class="space-y-8">
                                        <div>
                                            <h3 class="text-lg leading-6 font-medium">
                                                Speicherort
                                            </h3>
                                            <p class="mt-1 max-w-3xl text-sm text-white">
                                                Bitte tragen Sie hier den absoluten Serverpfad ein, an dem alle erzeugten Rechtstexte gespeichert werden sollen. Stellen Sie bitte sicher, dass der Ordner beschreibbar ist.
                                            </p>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <label for="path" class="block font-medium">
                                                Serverpfad.
                                            </label>
                                            <div class="mt-1">
                                                <input
                                                        type="text"
                                                        name="path"
                                                        id="path"
                                                        data-default="<?php echo dirname(__FILE__);?>"
                                                        value="<?php echo dirname(__FILE__);?>"
                                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-primary">
                                            </div>
                                            <div class="mt-1 text-right">
                                                <a class="resetPath text-sm" href="#">Zurücksetzen</a>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="py-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                            <div class="flex space-x-2">
                                                <button class="button2 mr-auto" type="button">Zurück</button>
                                                <button class="button ml-auto" type="submit">Weiter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="step" id="step4">
                            <form class="nextStepForm" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="POST">
                                <input type="hidden" name="method" value="registerClient">
                                <div>
                                    <div class="space-y-8">
                                        <div>
                                            <h3 class="text-lg leading-6 font-medium">
                                                API-Client
                                            </h3>
                                            <p class="mt-1 max-w-3xl text-sm text-white">
                                                Damit Sie bequem Ihre Rechtstexte mithilfe des eRecht24 Projekt Managers aktualisieren können, wird nun ein API-Client für Ihr Projekt angelegt.
                                                Sie können nach Abschluss dieses Installationsprozesses im eRecht24 Projekt Manager bei den entsprechenden Rechtstexten auf den "synchronisieren"-Button klicken, um die Rechtstexte zu aktualisieren.
                                            </p>
                                        </div>
                                        <div>
                                            <div class="pb-4">
                                                <div class="border-t border-gray-200"></div>
                                            </div>
                                            <div class="flex space-x-2">
                                                <button class="button2 mr-auto" type="button">Zurück</button>
                                                <button class="button ml-auto" type="submit">Weiter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="step" id="step5">
                            <form id="finishInstallationForm" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="POST">
                                <input type="hidden" name="method" value="finishInstallation">

                                <div class="space-y-8">
                                    <div>
                                        <h3 class="text-lg leading-6 font-medium">
                                            Installation abschließen
                                        </h3>
                                        <p class="mt-1 max-w-3xl text-sm text-white">
                                            Bitte klicken Sie auf den Button: "Installation abschließen", um die Konfiguration abzuschließen.<br><br>
                                            <strong>Bitte beachten Sie, dass Sie die Konfiguration später nur noch anpassen können, nachdem Sie auf Ihrem Webspace die xxxxxxxxxxxxxxxxxxxxxx.eRecht24.json-Datei gelöscht haben. Der Installationsassistent kann sonst NICHT mehr gestartet werden.</strong>
                                        </p>
                                        <div class="py-4">
                                            <div class="border-t border-gray-200"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex">
                                            <button class="button ml-auto" type="submit">Installation abschließen</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="step" id="step6">
                            <form id="importLegalTexts" action="//<?php echo $_SERVER['HTTP_HOST'] .$_SERVER['REQUEST_URI']?>" method="GET">
                                <input type="hidden" name="erecht24_secret" id="erecht24_secret">
                                <input type="hidden" name="client_id" id="client_id">
                                <input type="hidden" name="erecht24_type" id="erecht24_type" value="all">


                                <div class="space-y-8">
                                    <div>
                                        <h3 class="text-lg leading-6 font-medium">
                                            Fertig. Importieren Sie nun Ihre Rechtstexte
                                        </h3>
                                        <p class="mt-1 max-w-3xl text-sm text-white">
                                            Herzlichen Glückwunsch, Sie haben die Installation erfolgreich abgeschlossen.
                                            Sie können nun initial Ihre eRecht24 Premium Rechtstexte importieren.
                                            Bei zukünftigen Aktualisierungen können Sie im eRecht24 Projekt Manager bei den entsprechenden Rechtstexten auf den "synchronisieren"-Button klicken, um die Rechtstexte zu aktualisieren.
                                        </p>
                                        <div class="py-4">
                                            <div class="border-t border-gray-200"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="text-lg leading-6 font-medium">
                                            Optional: Passen Sie das Layout an Ihre Website an
                                        </h3>
                                        <p class="mt-1 text-sm text-white">
                                            Passen Sie nun noch das Aussehen Ihrer Rechtstexte an Ihre Webseite an.
                                            Hierzu können sie sogenannte Template-Dateien anpassen.
                                            Diese befinden sich im Ordner <strong><?php echo dirname(__FILE__) ?>/tpl</strong> und enthalten Ihren HTML und CSS-Quellcode für die Webseite und einen Platzhalter.
                                            Anstelle des Platzhalters wird dann durch das Skript später der Rechtstext eingesetzt.
                                        </p>
                                        <div class="rounded w-full p-6 shadow text-primary bg-white mt-8">
                                            &lt;!DOCTYPE html&gt;<br>
                                            &lt;html&gt;<br>
                                            &nbsp;&nbsp;&nbsp;&lt;head&gt;<br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gray-400">&lt;!-- Sie k&ouml;nnen im Header CSS und JavaScript einf&uuml;gen, wie Sie m&ouml;gen --&gt;</span><br>
                                            &nbsp;&nbsp;&nbsp;&lt;/head&gt;<br>
                                            &nbsp;&nbsp;&nbsp;&lt;body&gt;<br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gray-400">&lt;!-- Sie k&ouml;nnen im Body HTML, CSS und JavaScript einf&uuml;gen, wie Sie m&ouml;gen --&gt;</span><br><br>

                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong class="text-red">&lt;!-- Den nachfolgenden Platzhalter sollten Sie nicht entfernen. Er wird durch den entsprechenden eRecht24 Rechtstext ersetzt. --&gt;</strong><br>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong class="text-black">{{eRecht24_legal_text}}</strong><br><br>


                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gray-400">&lt;!-- Sie k&ouml;nnen im Body HTML, CSS und JavaScript einf&uuml;gen, wie Sie m&ouml;gen --&gt;</span><br>
                                            &nbsp;&nbsp;&nbsp;&lt;/body&gt;<br>
                                            &lt;/html&gt;
                                        </div>
                                    </div>
                                    <div>
                                        <div class="py-4">
                                            <div class="border-t border-gray-200"></div>
                                        </div>
                                        <div class="flex">
                                            <button class="button ml-auto" type="submit">Rechtstexte importieren</button>
                                            <p class="hidden finished">Ihre Rechtstexte wurden bereits erfolgreich importiert. Sie können den Installer nun schließen</p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div id="loader" class="inset-0 fixed flex justify-center items-center">
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        <div id="overlay" class="hidden fixed inset-0 bg-gray-800 bg-opacity-60 z-0"></div>
        <script type="text/javascript">
            document.querySelectorAll('.step').forEach(function (section){
                if (section.id !== 'step1')
                    section.classList.add('blocked');
            })

            document.querySelectorAll('.button2').forEach(function(trigger) {
                trigger.addEventListener("click", function () {
                    const target = document.querySelector('.step.active');

                    target.classList.remove('active');
                    target.classList.add('blocked');
                    target.previousElementSibling.classList.add('active')

                    // block next elements
                    const siblings = nextSiblings(target);
                    siblings.forEach(section => section.classList.add('blocked'));
                });
            });

            document.querySelectorAll('[data-target]').forEach(function(trigger) {
                trigger.addEventListener("click", function () {
                    const target = document.getElementById(this.dataset.target);
                    // check if allowed
                    if (target.classList.contains('blocked'))
                        return;

                    // open tab close other ones
                    document.getElementById('body').dataset.completed = (this.previousElementSibling)
                        ? this.previousElementSibling.dataset.target
                        : "";

                    document.querySelectorAll('.step').forEach(function(section) {
                        section.classList.remove('active');
                    });
                    target.classList.add('active');

                    // block next elements
                    const siblings = nextSiblings(target);
                    siblings.forEach(section => section.classList.add('blocked'));
                });
            });

            document.querySelectorAll('.hintTrigger').forEach(function(trigger) {
                trigger.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const content = trigger.nextElementSibling;

                    if (content.classList.contains('hidden')) {
                        document.getElementById('overlay').classList.remove('hidden')
                        content.classList.remove('hidden')
                    }
                    else {
                        document.getElementById('overlay').classList.add('hidden')
                        content.classList.add('hidden')
                    }
                });
            });

            document.querySelectorAll('.hintContent').forEach(function(popup) {
                popup.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            });

            document.getElementById('body').addEventListener("click", (e) => {
                closeHints()
            }, false);

            document.addEventListener('keydown', function(event){
                if(event.key === "Escape")
                    closeHints()
            });

            document.querySelectorAll('.nextStepForm').forEach(function(form) {
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    showLoader();

                    const xhr = new XMLHttpRequest();
                    xhr.addEventListener('load', function () {
                        hideLoader();

                        let responseJson;
                        try {
                            responseJson = JSON.parse(xhr.responseText);
                        } catch (error) {
                            alert('Wir konnten Ihre Einstellungen nicht speichern. Bitte überprüfen Sie Ihre Servereinstellungen.')
                            return;
                        }

                        if (responseJson.status !== 200) {
                            alert(responseJson.message)
                            return;
                        }

                        if(responseJson.data.hasOwnProperty('erecht24_secret'))
                            document.getElementById('erecht24_secret').value = responseJson.data.erecht24_secret;

                        if(responseJson.data.hasOwnProperty('client_id'))
                            document.getElementById('client_id').value = responseJson.data.client_id;

                        // show next section
                        const current = document.querySelector('.step.active');
                        document.getElementById('body').dataset.completed = current.id
                        const next = current.nextElementSibling;
                        next.classList.remove('blocked')
                        document.querySelectorAll('.step').forEach(function(section) {
                            section.classList.remove('active');
                        });
                        next.classList.add('active');
                    })

                    const formData = new FormData(form);
                    if (!formData.has('api_key'))
                        formData.append("api_key", document.getElementById('api_key').value);

                    if (!formData.has('erecht24_secret'))
                        formData.append("erecht24_secret", document.getElementById('erecht24_secret').value);

                    // url of the registered client
                    formData.append("setup_url_protocol", window.location.protocol);

                    xhr.open("POST", form.getAttribute("action"));
                    xhr.send(formData);

                }, false);
            });

            document.getElementById('finishInstallationForm').addEventListener("submit", (e) => {
                e.preventDefault();
                showLoader();

                const xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function () {
                    hideLoader();

                    let responseJson;
                    try {
                        responseJson = JSON.parse(xhr.responseText);
                    } catch (error) {
                        alert('Wir konnten Ihre Einstellungen nicht speichern. Bitte überprüfen Sie Ihre Servereinstellungen.')
                        return;
                    }

                    if (responseJson.status !== 200) {
                        alert(responseJson.message)
                        return;
                    }

                    // show next section
                    const current = document.querySelector('.step.active');
                    document.getElementById('body').dataset.completed = current.id
                    const next = current.nextElementSibling;
                    next.classList.remove('blocked')
                    document.querySelectorAll('.step').forEach(function(section) {
                        section.classList.remove('active');
                    });
                    next.classList.add('active');
                })

                const formData = new FormData(e.target);

                formData.append("api_key", document.getElementById('api_key').value);
                formData.append("erecht24_secret", document.getElementById('erecht24_secret').value);
                formData.append("client_id", document.getElementById('client_id').value);
                formData.append("path", document.getElementById('path').value);
                formData.append("impressum", document.getElementById('impressum').value);
                formData.append("site_notice", document.getElementById('site_notice').value);
                formData.append("datenschutz", document.getElementById('datenschutz').value);
                formData.append("privacy", document.getElementById('privacy').value);

                xhr.open("POST", e.target.getAttribute("action"));
                xhr.send(formData);

            }, false);

            document.getElementById('importLegalTexts').addEventListener("submit", (e) => {
                e.preventDefault();
                showLoader();

                var url = e.target.getAttribute("action");
                var params = "erecht24_type=all&erecht24_secret=" + document.getElementById('erecht24_secret').value;
                var http = new XMLHttpRequest();

                http.open("GET", url+"?"+params, true);
                http.onreadystatechange = function()
                {
                    if (http.readyState === 4) {
                        hideLoader();
                        if(http.status === 200) {
                            alert('Ihre Rechtstexte wurden bereits erfolgreich importiert. Sie können den Installer nun schließen.')
                            document.querySelector('#importLegalTexts .button').style.display = 'none';
                            document.querySelector('#importLegalTexts .finished').classList.remove('hidden');
                        } else {
                            alert('Wir konnten die Rechtstexte nicht importieren. Bitte wiederholen Sie den Installationsassistenten. Erfahren Sie mehr in den FAQ.')
                        }
                    }
                }
                http.send(null);
            }, false);

            document.querySelector('.resetPath').addEventListener('click', function (){
                document.getElementById('path').value =document.getElementById('path').dataset.default
            })

            const nextSiblings = (elem) => {
                let siblings = [];

                while (elem = elem.nextElementSibling) {
                    siblings.push(elem);
                }
                return siblings;
            };
            function showLoader() {
                document.getElementById('loader').style.display="flex"
            }
            function hideLoader() {
                document.getElementById('loader').style.display="none"
            }
            function closeHints() {
                document.querySelectorAll('.hintContentContainer').forEach(function (content){
                    content.classList.add('hidden');
                })
                document.getElementById('overlay').classList.add('hidden')
            }
        </script>
        </body>
    </html><?php die();
endif;
