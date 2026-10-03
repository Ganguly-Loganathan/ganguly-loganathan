// ==========================================
// 1. THREE.JS BACKGROUND SCENE
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

    // Background Wireframe Shape
    const torusGroup = new THREE.Group();
    scene.add(torusGroup);

    const torusGeo = new THREE.TorusKnotGeometry(8, 2.2, 120, 16);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        wireframe: true,
        transparent: true,
        opacity: 0.1
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
        opacity: 0.3
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
// 2. STRAIGHT 3D AVATAR WITH DYNAMIC RINGS
// ==========================================

const avatarContainer = document.getElementById("avatar-container");

if (avatarContainer && typeof THREE !== "undefined") {

    const avatarScene = new THREE.Scene();

    const avatarCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    avatarCamera.position.z = 4.8;

    const avatarRenderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    avatarRenderer.setSize(240, 240);
    avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    avatarContainer.appendChild(avatarRenderer.domElement);

    const avatarGroup = new THREE.Group();
    avatarScene.add(avatarGroup);

    // Texture Loader for Profile Image
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("profile.jpg", (texture) => {

        // Rotate texture 90 degrees upright
        texture.center.set(0.5, 0.5);
        texture.rotation = -Math.PI / 2;

        // 1. Circular Disc for Profile Image
        const discGeo = new THREE.CircleGeometry(1.6, 64);
        const discMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const avatarMesh = new THREE.Mesh(discGeo, discMat);
        avatarGroup.add(avatarMesh);

        // 2. Outer Rotating 3D Ring
        const ringGeo = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const outerRing = new THREE.Mesh(ringGeo, ringMat);
        avatarGroup.add(outerRing);

        // 3. Orbiting Particle Ring
        const particleCount = 40;
        const orbitGeo = new THREE.BufferGeometry();
        const orbitPos = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            orbitPos[i * 3] = Math.cos(angle) * 2.1;
            orbitPos[i * 3 + 1] = Math.sin(angle) * 2.1;
            orbitPos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }

        orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
        const orbitMat = new THREE.PointsMaterial({
            color: 0x0d9488,
            size: 0.08,
            transparent: true,
            opacity: 0.9
        });

        const orbitParticles = new THREE.Points(orbitGeo, orbitMat);
        avatarGroup.add(orbitParticles);

        const avatarClock = new THREE.Clock();

        function animateAvatar() {
            requestAnimationFrame(animateAvatar);

            const elapsedTime = avatarClock.getElapsedTime();

            // Rings rotate smoothly while the main profile disc stays straight
            outerRing.rotation.z = elapsedTime * 0.5;
            orbitParticles.rotation.z = -elapsedTime * 0.8;

            avatarRenderer.render(avatarScene, avatarCamera);
        }

        animateAvatar();
    });
}

// ==========================================
// 3. INTERACTIVE 3D GLASS CARDS TILT
// ==========================================

const cards = document.querySelectorAll('.3d-card');

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
