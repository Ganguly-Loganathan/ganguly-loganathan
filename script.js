// ==========================================
// THREE.JS INTERACTIVE DYNAMIC BACKGROUND
// ==========================================

const canvas = document.getElementById("bg-canvas");

if (canvas && typeof THREE !== "undefined") {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ------------------------------------------
    // 1. Dual-Layer Wireframe Globe
    // ------------------------------------------

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Outer Wireframe Globe
    const outerGeo = new THREE.IcosahedronGeometry(11, 2);
    const outerMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerSphere);

    // Inner Core Wireframe (Rotates in Opposite Direction)
    const innerGeo = new THREE.IcosahedronGeometry(6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerSphere);

    // ------------------------------------------
    // 2. Interactive Floating Particle Network
    // ------------------------------------------

    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 50;     // X
        particlePositions[i + 1] = (Math.random() - 0.5) * 50; // Y
        particlePositions[i + 2] = (Math.random() - 0.5) * 50; // Z
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ------------------------------------------
    // 3. Pointer & Scroll Smooth Tracking (Lerp)
    // ------------------------------------------

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    function updatePointer(x, y) {
        targetX = (x / window.innerWidth - 0.5) * 2;
        targetY = (y / window.innerHeight - 0.5) * 2;
    }

    document.addEventListener("mousemove", (event) => {
        updatePointer(event.clientX, event.clientY);
    });

    document.addEventListener("touchmove", (event) => {
        if (event.touches.length > 0) {
            updatePointer(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    // ------------------------------------------
    // 4. Animation Loop
    // ------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth Lerp for natural movement dampening
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Base Rotations
        outerSphere.rotation.x = elapsedTime * 0.05 + mouseY * 0.2;
        outerSphere.rotation.y = elapsedTime * 0.08 + mouseX * 0.2;

        innerSphere.rotation.x = -elapsedTime * 0.08;
        innerSphere.rotation.y = -elapsedTime * 0.1;

        // Particle Drift
        particles.rotation.y = elapsedTime * 0.02;

        // Parallax scroll movement across page sections
        mainGroup.position.y = scrollY * 0.005;
        camera.position.y = -scrollY * 0.003;

        renderer.render(scene, camera);
    }

    animate();

    // ------------------------------------------
    // 5. Responsive Resize
    // ------------------------------------------

    window.addEventListener("resize", function () {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // ------------------------------------------
    // 6. Interactive 3D Card Tilt Effects
    // ------------------------------------------

    const tiltCards = document.querySelectorAll('.glass-card, .skill-card, .timeline-item');

    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}
