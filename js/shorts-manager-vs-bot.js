(function () {
    'use strict';

    const TOTAL_MS = 15000;
    const SCENES = [
        { id: 's1', start: 0, end: 2000 },
        { id: 's2', start: 2000, end: 5000 },
        { id: 's3', start: 5000, end: 12000 },
        { id: 's4', start: 12000, end: 15000 },
    ];

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

    function scaleStage() {
        if (!stage) return;
        const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920) * 0.98;
        stage.style.transform = `scale(${scale})`;
    }

    function setScene(id) {
        if (activeSceneId === id) return;
        activeSceneId = id;
        Object.values(sceneEls).forEach((el) => el.classList.remove('is-active'));
        sceneEls[id]?.classList.add('is-active');
    }

    function resetPhoneDemo() {
        phoneDemoStarted = false;
        document.querySelectorAll('.shorts_bubble').forEach((b) => {
            b.classList.remove('show');
        });
        document.querySelectorAll('.shorts_key').forEach((k) => k.classList.remove('is-pulse'));
        document.getElementById('shorts-alert')?.classList.remove('show');
        document.getElementById('shorts-connector')?.classList.remove('show');
    }

    function fullReset() {
        activeSceneId = null;
        resetPhoneDemo();
        setScene('s1');
    }

    function showBubble(id, delay) {
        setTimeout(() => {
            document.getElementById(id)?.classList.add('show');
        }, delay);
    }

    function runPhoneDemo() {
        if (phoneDemoStarted) return;
        phoneDemoStarted = true;
        resetPhoneDemo();

        showBubble('b-welcome', 100);
        showBubble('b-user-book', 900);

        setTimeout(() => {
            document.getElementById('k-book')?.classList.add('is-pulse');
        }, 1100);

        showBubble('b-step1', 1800);
        showBubble('b-user-name', 2600);
        showBubble('b-step2', 3200);
        showBubble('b-user-task', 3900);
        showBubble('b-step3', 4500);
        showBubble('b-user-contact', 5100);
        showBubble('b-success', 5700);

        setTimeout(() => {
            document.getElementById('shorts-connector')?.classList.add('show');
            document.getElementById('shorts-alert')?.classList.add('show');
        }, 6200);
    }

    function tick(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (elapsed >= TOTAL_MS + 600) {
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
        rafId = requestAnimationFrame(tick);
    }

    if (new URLSearchParams(location.search).has('record')) {
        document.body.classList.add('is-recording');
    }

    window.addEventListener('resize', scaleStage);
    scaleStage();
    start();

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            start();
        }
    });
})();
