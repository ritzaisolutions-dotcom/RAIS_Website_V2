(function () {
    'use strict';

    var TOTAL = 7;

    function initCollabPath(root) {
        if (!root) return;

        var steps = root.querySelectorAll('.collab-step');
        var prevBtn = root.querySelector('#collab-prev');
        var nextBtn = root.querySelector('#collab-next');
        var counter = root.querySelector('#collab-counter');
        var stepButtons = root.querySelectorAll('[data-step-btn]');

        function setActive(step) {
            var n = Math.max(1, Math.min(TOTAL, step));
            root.setAttribute('data-active-step', String(n));

            steps.forEach(function (el) {
                var id = parseInt(el.getAttribute('data-step'), 10);
                el.classList.remove('is-active', 'is-completed');
                if (id < n) el.classList.add('is-completed');
                if (id === n) el.classList.add('is-active');
            });

            stepButtons.forEach(function (btn) {
                var id = parseInt(btn.getAttribute('data-step-btn'), 10);
                if (id === n) {
                    btn.setAttribute('aria-current', 'step');
                } else {
                    btn.removeAttribute('aria-current');
                }
            });

            if (counter) {
                counter.textContent = 'Schritt ' + n + ' von ' + TOTAL;
            }
            if (prevBtn) prevBtn.disabled = n <= 1;
            if (nextBtn) nextBtn.disabled = n >= TOTAL;
        }

        stepButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setActive(parseInt(btn.getAttribute('data-step-btn'), 10));
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                setActive(parseInt(root.getAttribute('data-active-step'), 10) - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                setActive(parseInt(root.getAttribute('data-active-step'), 10) + 1);
            });
        }

        root.addEventListener('keydown', function (e) {
            var current = parseInt(root.getAttribute('data-active-step'), 10);
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive(current - 1);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive(current + 1);
            }
        });

        setActive(parseInt(root.getAttribute('data-active-step'), 10) || 1);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initCollabPath(document.getElementById('collab-path'));
        });
    } else {
        initCollabPath(document.getElementById('collab-path'));
    }
})();
