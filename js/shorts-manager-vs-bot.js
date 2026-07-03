(function () {
    'use strict';

    const TOTAL_MS = 23000;
    const SCENES = [
        { id: 's1', start: 0, end: 3500 },
        { id: 's2', start: 3500, end: 7000 },
        { id: 's3', start: 7000, end: 18000 },
        { id: 's4', start: 18000, end: 23000 },
    ];

    const shell = document.getElementById('shorts-shell');
    const stage = document.getElementById('shorts-stage');
    const progress = document.getElementById('shorts-progress');
    const sceneEls = {};
    document.querySelectorAll('.shorts_scene').forEach((el) => {
        sceneEls[el.id] = el;
    });

    let startTime = null;
    let rafId = null;
    let phoneDemoStarted = false;
    let activeSceneId = null;
    let phoneTimers = [];

    function scaleStage() {
        if (!stage || !shell) return;
        const sw = shell.clientWidth;
        const sh = shell.clientHeight;
        const scale = Math.min(sw / 1080, sh / 1920);
        stage.style.transform = `scale(${scale})`;
    }

    function setScene(id) {
        if (activeSceneId === id) return;
        activeSceneId = id;
        Object.values(sceneEls).forEach((el) => el.classList.remove('is-active'));
        sceneEls[id]?.classList.add('is-active');
    }

    function clearPhoneTimers() {
        phoneTimers.forEach(clearTimeout);
        phoneTimers = [];
    }

    function resetPhoneVisuals() {
        clearPhoneTimers();
        document.querySelectorAll('.shorts_bubble').forEach((b) => b.classList.remove('show'));
        document.querySelectorAll('.shorts_key').forEach((k) => k.classList.remove('is-pulse'));
        document.getElementById('shorts-alert')?.classList.remove('show');
    }

    function resetPhoneDemo() {
        phoneDemoStarted = false;
        resetPhoneVisuals();
    }

    function fullReset() {
        activeSceneId = null;
        resetPhoneDemo();
        setScene('s1');
    }

    function later(fn, ms) {
        phoneTimers.push(setTimeout(fn, ms));
    }

    function showBubble(id, delay) {
        later(() => document.getElementById(id)?.classList.add('show'), delay);
    }

    function runPhoneDemo() {
        if (phoneDemoStarted) return;
        phoneDemoStarted = true;
        resetPhoneVisuals();

        showBubble('b-welcome', 200);
        showBubble('b-user-book', 1400);
        later(() => document.getElementById('k-book')?.classList.add('is-pulse'), 1600);

        showBubble('b-step1', 2600);
        showBubble('b-user-name', 3800);
        showBubble('b-step2', 4800);
        showBubble('b-user-task', 6000);
        showBubble('b-step3', 7200);
        showBubble('b-user-contact', 8400);
        showBubble('b-success', 9600);

        later(() => document.getElementById('shorts-alert')?.classList.add('show'), 10200);
    }

    function tick(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (elapsed >= TOTAL_MS + 800) {
            startTime = now;
            fullReset();
            rafId = requestAnimationFrame(tick);
            return;
        }

        const t = Math.min(elapsed, TOTAL_MS);

        if (progress) {
            progress.style.width = `${(t / TOTAL_MS) * 100}%`;
        }

        let current = SCENES[0];
        for (const scene of SCENES) {
            if (t >= scene.start && t < scene.end) {
                current = scene;
                break;
            }
        }

        const prev = activeSceneId;
        setScene(current.id);
        if (current.id === 's3' && prev !== 's3') runPhoneDemo();

        rafId = requestAnimationFrame(tick);
    }

    function start() {
        startTime = null;
        fullReset();
        cancelAnimationFrame(rafId);
        scaleStage();
        rafId = requestAnimationFrame(tick);
    }

    if (new URLSearchParams(location.search).has('record')) {
        document.body.classList.add('is-recording');
    }

    window.addEventListener('resize', scaleStage);
    if (document.fonts?.ready) {
        document.fonts.ready.then(scaleStage);
    }
    scaleStage();
    start();

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            start();
        }
    });
})();
