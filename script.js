// ==========================================
// THREE.JS INTERACTIVE BACKGROUND SCENE
// ==========================================

const bgCanvas = document.getElementById("bg-canvas");

if (bgCanvas && typeof THREE !== "undefined") {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Background Wireframe Centerpiece
    const torusGroup = new THREE.Group();
    scene.add(torusGroup);

    const torusGeo = new THREE.TorusKnotGeometry(8, 2.2, 120, 16);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });

    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusGroup.add(torusKnot);

    // Floating Ambient Particles
    const particlesCount = 600;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 90;
        positions[i + 1] = (Math.random() - 0.5) * 90;
        positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.18,
        color: 0x2563eb,
        transparent: true,
        opacity: 0.35
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const spotlight = document.querySelector('.glow-spotlight');

    document.addEventListener("mousemove", (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (spotlight) {
            spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
            spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
    });

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();

    function animateBg() {
        requestAnimationFrame(animateBg);

        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        torusKnot.rotation.x = elapsedTime * 0.1 + mouseY * 0.2;
        torusKnot.rotation.y = elapsedTime * 0.12 + mouseX * 0.2;
        particleSystem.rotation.y = elapsedTime * 0.02;

        torusGroup.position.y = -scrollY * 0.008;

        renderer.render(scene, camera);
    }

    animateBg();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==========================================
// INTERACTIVE 3D GLASS CARDS TILT
// ==========================================

const cards = document.querySelectorAll('.card-3d');

cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `perspective(1000px) rotateX(${-y / 14}deg) rotateY(${x / 14}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});
