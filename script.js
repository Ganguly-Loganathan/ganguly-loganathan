// Texture Loader for Profile Image
const textureLoader = new THREE.TextureLoader();
textureLoader.load("profile.jpg", (texture) => {

    // Fix sideways orientation
    texture.center.set(0.5, 0.5);
    texture.rotation = -Math.PI / 2; // Rotates texture 90 degrees upright

    // 1. Perfectly Straight Circular Disc
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

        // The image stays 100% straight while outer rings spin
        outerRing.rotation.z = elapsedTime * 0.5;
        orbitParticles.rotation.z = -elapsedTime * 0.8;

        avatarRenderer.render(avatarScene, avatarCamera);
    }

    animateAvatar();
});
